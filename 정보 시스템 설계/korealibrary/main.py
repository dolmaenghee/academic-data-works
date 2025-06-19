from fastapi import FastAPI, HTTPException, Query
from fastapi.templating import Jinja2Templates
from fastapi.responses import JSONResponse
from fastapi import Request
from fastapi.staticfiles import StaticFiles
from contextlib import contextmanager
import pymysql


templates = Jinja2Templates(directory="templates")

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")

@contextmanager
def get_db_connection():
    conn = pymysql.connect(
        host="127.0.0.1", user="root", password="Wonwoo0717!", 
        db='korea library', charset="utf8", cursorclass=pymysql.cursors.DictCursor
    )
    try:
        yield conn
    finally:
        conn.close()

@app.get("/")
async def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/search/")
async def search(request: Request):
    return templates.TemplateResponse("search.html", {"request": request})

@app.get("/search_get/")
async def search_get(request: Request):
    return templates.TemplateResponse("search_get.html", {"request": request})

@app.get("/book_state/")
async def book_state(request: Request):
    return templates.TemplateResponse("book_state.html", {"request": request})

@app.get("/insert/")
async def insert(request: Request):
    return templates.TemplateResponse("insert.html", {"request": request})

@app.get("/userInfo/")
def get_user_info():
    try:
        with get_db_connection() as conn:
            cur = conn.cursor()
            sql = """
                SELECT student.학번, student.이름, book.도서명, easy_loan.대출신청일, easy_loan.청구기호, 
                easy_loan.신청승인, 
                CASE WHEN easy_loan.신청승인 = 'Y' THEN machine.위치 ELSE easy_loan.소장처 END AS 수령처
                FROM student 
                JOIN easy_loan ON student.학번 = easy_loan.학번 
                JOIN book ON easy_loan.청구기호 = book.청구기호 
                LEFT JOIN machine ON book.대출기번호 = machine.대출기번호;
            """
            cur.execute(sql)
            row = cur.fetchall()
            print(row)
            return row
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/userInfo_get/")
def get_user_info_by_number_and_name(memberId: str = Query(..., description="학번을 입력하세요")):
    try:
        print(f"Received 학번: {memberId}")
        with get_db_connection() as conn:
            cur = conn.cursor()
            query_check_overdue = """
                SELECT 1
                FROM easy_loan
                WHERE 학번 = %s AND 대출신청일 <= DATE_SUB(NOW(), INTERVAL 4 DAY)
                LIMIT 1;
            """
            cur.execute(query_check_overdue, (memberId,))
            overdue_check = cur.fetchone()
            print(f"Overdue check: {overdue_check}")

            if overdue_check:
                query_update_approval = """
                    UPDATE easy_loan
                    SET 신청승인 = 'N'
                    WHERE 학번 = %s AND 대출신청일 <= DATE_SUB(NOW(), INTERVAL 4 DAY);
                """
                cur.execute(query_update_approval, (memberId,))
                conn.commit()
                print(f"Updated approval status to 'N' for 학번: {memberId}")

            query_main = """
                SELECT student.학번, student.이름, book.도서명, easy_loan.대출신청일, easy_loan.청구기호, easy_loan.신청승인,
                CASE WHEN easy_loan.신청승인 = 'Y' THEN machine.위치 ELSE easy_loan.소장처 END AS 수령처
                FROM student
                JOIN easy_loan ON student.학번 = easy_loan.학번
                JOIN book ON easy_loan.청구기호 = book.청구기호
                LEFT JOIN machine ON book.대출기번호 = machine.대출기번호
                WHERE student.학번 = %s;
            """
            cur.execute(query_main, (memberId,))
            row = cur.fetchall()
            print(f"Query result: {row}")

            if not row:
                raise HTTPException(status_code=404, detail="User not found")

            return row
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/books/")
def get_book_by_name(book_name: str = Query(..., description="도서명을 입력하세요")):
    try:
        print(f"Received 책: {book_name}")
        with get_db_connection() as conn:
            cur = conn.cursor()
            sql = "SELECT * FROM book WHERE 도서명 = %s"
            print(f"Executing query: {sql} with parameter: {book_name}")
            cur.execute(sql, (book_name,))
            row = cur.fetchall()
            print(f"Query result: {row}")

            if not row:
                raise HTTPException(status_code=404, detail="Book not found")

            return row
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/approve/")
def approve_loan(book_code: str = Query(...), book_location: str = Query(...)):
    try:
        if not book_code or not book_location:
            raise HTTPException(status_code=422, detail="book_code and book_location are required")

        print(f"Received book_code: {book_code}")
        print(f"Received book_location: {book_location}")

        with get_db_connection() as conn:
            cur = conn.cursor()
            query_main = """
            SELECT
            easy_loan.`청구기호`, book.`도서명`, easy_loan.`신청승인`,
            CASE
                WHEN easy_loan.`신청승인` = 'Y' THEN machine.`위치`
                ELSE easy_loan.`소장처`
            END AS `수령처`
            FROM
                easy_loan
            JOIN
                book ON easy_loan.`청구기호` = book.`청구기호` AND easy_loan.`소장처` = book.`소장처`
            LEFT JOIN
                machine ON book.`대출기번호` = machine.`대출기번호`
            WHERE easy_loan.청구기호 = %s AND easy_loan.소장처 = %s;
            """
            print(f"Executing query: {query_main} with parameters: {book_code}, {book_location}")
            cur.execute(query_main, (book_code, book_location))
            row = cur.fetchall()
            print(f"Query result: {row}")

            if not row:
                raise HTTPException(status_code=404, detail="Loan info not found")

            return row
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/update_status/")
def update_status(book_code: str, book_location: str):
    try:
        with get_db_connection() as conn:
            cur = conn.cursor()
            update_query = "UPDATE book SET 도서상태 = '대출불가' WHERE 청구기호 = %s AND 소장처 = %s"
            cur.execute(update_query, (book_code, book_location))
            conn.commit()
            return JSONResponse(content={"message": "Book status updated successfully"})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/booksInfo/")
def get_book_info():
    try:
        with get_db_connection() as conn:
            cur = conn.cursor()
            sql = "SELECT * FROM book"
            cur.execute(sql)
            row = cur.fetchall()
            print(row)
            return row
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))





