document.addEventListener('DOMContentLoaded', function() {
    const loadButton = document.getElementById('load-button');
    const table = document.getElementById('data-table');
    const bookForm = document.getElementById('book-form');

    loadButton.addEventListener('click', function() {
        const dataUrl = 'http://127.0.0.1:7000/booksInfo/';  // JSON 데이터를 가져올 API URL
        fetch(dataUrl)
            .then(response => response.json())
            .then(data => {
                const tableBody = document.querySelector('#data-table tbody');
                tableBody.innerHTML = ''; // 테이블을 초기화합니다.

                data.forEach(item => {

                    const row = document.createElement('tr');

                    const codeCell = document.createElement('td');
                    codeCell.textContent = item.청구기호;
                    row.appendChild(codeCell);
                    
                    const locationCell = document.createElement('td');
                    locationCell.textContent = item.소장처;
                    row.appendChild(locationCell);

                    const bookCell = document.createElement('td');
                    bookCell.textContent = item.도서명;
                    row.appendChild(bookCell);

                    const stateCell = document.createElement('td');
                    stateCell.textContent = item.도서상태;
                    row.appendChild(stateCell);

                    
                    tableBody.appendChild(row);
                });

                table.style.display = 'table'; // 테이블을 표시합니다.
            })
            .catch(error => {
               
                console.error('Error fetching the data:', error);
            });
    });

    bookForm.addEventListener('submit', function(event) {
        event.preventDefault();
        searchBooks();
    });

    function searchBooks() {
        const book_name = document.getElementById('book_name').value.trim();

        // 입력값이 없는 경우 경고
        if (!book_name) {
            alert('도서명을 입력해주세요.');
            return;
        }

        const dataUrl = `http://127.0.0.1:7000/books/?book_name=${encodeURIComponent(book_name)}`;

        console.log(dataUrl);

        fetch(dataUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                const tableBody = document.querySelector('#data-table tbody');
                tableBody.innerHTML = ''; // 테이블을 초기화합니다.

                console.log(data);

                data.forEach(item => {
                    const row = document.createElement('tr');

                    const codeCell = document.createElement('td');
                    codeCell.textContent = item.청구기호;
                    row.appendChild(codeCell);
                    
                    const locationCell = document.createElement('td');
                    locationCell.textContent = item.소장처;
                    row.appendChild(locationCell);

                    const bookCell = document.createElement('td');
                    bookCell.textContent = item.도서명;
                    row.appendChild(bookCell);

                    const stateCell = document.createElement('td');
                    stateCell.textContent = item.도서상태;
                    row.appendChild(stateCell);

                    const loanButtonCell = document.createElement('td');
                    const loanButton = document.createElement('button');
                    loanButton.textContent = '대출신청';
                    loanButton.className = 'btn btn-primary';
                    loanButton.addEventListener('click', function() {
                        if (item.도서상태 === '대출불가') {
                            alert('예약신청이 완료되었습니다.')
                        } else {
                            approveLoan(item.청구기호, item.소장처);
                        }
                    });
                    loanButtonCell.appendChild(loanButton);
                    row.appendChild(loanButtonCell);

                    tableBody.appendChild(row);
                });

                table.style.display = 'table'; // 테이블을 표시합니다.
            })
            .catch(error => {
                console.error('Error fetching the data:', error);
            });
    }

    function approveLoan(book_code, book_location) {
        $('#studentIdModal').modal('show');
    
        // 학번 제출 버튼 클릭 이벤트 설정
        document.getElementById('submitStudentIdButton').onclick = function() {
            const studentId = document.getElementById('studentIdInput').value;
            if (!studentId) {
                alert('학번을 입력해주세요.');
                return;
            }

            if (studentId === '20240032') {
                alert('수령제한일을 준수하지 않아 간편대출 불가 상태입니다.');
                return;
            }
            
            $('#studentIdModal').modal('hide');  // 모달 숨기기
    
            // DB에 대출 정보 추가
    
            const dataUrl = `http://127.0.0.1:7000/approve/?book_code=${encodeURIComponent(book_code)}&book_location=${encodeURIComponent(book_location)}&student_id=${encodeURIComponent(studentId)}`;
            console.log(dataUrl);  // 디버깅용 출력
    
            fetch(dataUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok ' + response.statusText);
                    }
                    return response.json();
                })
                .then(data => {
                    alert('대출신청이 완료되었습니다. 3일 이내 수령하시기 바랍니다.');
                    const approvalBody = document.querySelector('#approval-table tbody');
    
                    approvalBody.innerHTML = ''; // 테이블을 초기화합니다.
    
                    console.log(data);  // 디버깅용 출력
    
                    data.forEach(item => {
                        const row = document.createElement('tr');
    
                        const codeCell = document.createElement('td');
                        codeCell.textContent = item.청구기호;
                        row.appendChild(codeCell);
    
                        const locationCell = document.createElement('td');
                        locationCell.textContent = item.수령처;
                        row.appendChild(locationCell);
    
                        const bookCell = document.createElement('td');
                        bookCell.textContent = item.도서명;
                        row.appendChild(bookCell);
    
                        const approvalCell = document.createElement('td');
                        approvalCell.textContent = item.신청승인;
                        row.appendChild(approvalCell);
    
                        const changeLocationCell = document.createElement('td');
                        const changeLocationButton = document.createElement('button');
                        changeLocationButton.textContent = '수령처 변경';
                        changeLocationButton.className = 'btn btn-secondary';
                        changeLocationButton.setAttribute('data-book-code', item.청구기호);
                        changeLocationButton.setAttribute('data-book-location', item.수령처);
                        changeLocationButton.setAttribute('data-approval-status', item.신청승인);
                        changeLocationButton.addEventListener('click', function() {
                            openLocationModal(this);  // this를 통해 버튼 요소를 전달
                        });
                        changeLocationCell.appendChild(changeLocationButton);
                        row.appendChild(changeLocationCell);
    
                        approvalBody.appendChild(row);
                    });
    
                    const approvalTable = document.getElementById('approval-table');
                    if (!approvalTable) {
                        console.error('approvalTable이 존재하지 않습니다.');
                        return;
                    }
                    approvalTable.style.display = 'table'; // '신청승인' 테이블을 표시합니다.
    
                    // 책 상태를 '대출불가'로 업데이트
                    updateBookStatus(book_code, book_location);
                    resetForm();
                })
                .catch(error => {
                    console.error('Error fetching the data:', error);
                });
        };
    }
    
    function updateBookStatus(book_code, book_location) {
        const dataUrl = `http://127.0.0.1:7000/update_status/?book_code=${encodeURIComponent(book_code)}&book_location=${encodeURIComponent(book_location)}`;
        fetch(dataUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(() => {
                console.log('Book status updated successfully');
            })
            .catch(error => {
                console.error('Error updating book status:', error);
            });
    }
    
    function openLocationModal(button) {
        const modal = document.getElementById('locationModal');
        const locationSelect = document.getElementById('newLocationSelect');
        const saveButton = document.getElementById('saveLocationButton');
        const bookCode = button.getAttribute('data-book-code');
        const bookLocation = button.getAttribute('data-book-location');
        const approvalStatus = button.getAttribute('data-approval-status');
    
        locationSelect.innerHTML = '';
    
        if (approvalStatus === 'N') {
            const option1 = document.createElement('option');
            option1.value = '중앙도서관';
            option1.textContent = '중앙도서관';
            locationSelect.appendChild(option1);
    
            const option2 = document.createElement('option');
            option2.value = '과학도서관';
            option2.textContent = '과학도서관';
            locationSelect.appendChild(option2);
    
        } else if (approvalStatus === 'Y') {
            const option1 = document.createElement('option');
            option1.value = '백주년기념관';
            option1.textContent = '백주년기념관';
            locationSelect.appendChild(option1);
    
            const option2 = document.createElement('option');
            option2.value = '하나스퀘어';
            option2.textContent = '하나스퀘어';
            locationSelect.appendChild(option2);
        }
    
        saveButton.onclick = function() {
            const newLocation = locationSelect.value;
            updateTableRow(bookCode, bookLocation, newLocation);
            alert(`수령처가 ${newLocation}(으)로 변경되었습니다.`);
            $(modal).modal('hide');
        };
    
        $(modal).modal('show');
    }
    
    function updateTableRow(book_code, old_location, new_location) {
        const tableBody = document.querySelector('#approval-table tbody');
        const rows = tableBody.getElementsByTagName('tr');
        for (let row of rows) {
            const codeCell = row.cells[0].textContent;
            const locationCell = row.cells[1].textContent;
            if (codeCell === book_code && locationCell === old_location) {
                row.cells[1].textContent = new_location; // 수령처를 새로운 값으로 변경
            }
        }
    }
    
    function resetForm() {
        document.getElementById('book_name').value = '';
        document.querySelector('#data-table tbody').innerHTML = '';
    }
    
});


