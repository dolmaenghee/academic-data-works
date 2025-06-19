document.addEventListener('DOMContentLoaded', function() {

    const loadButton = document.getElementById('load-button');
    const table = document.getElementById('data-table');
    const memberForm = document.getElementById('member-form');

    loadButton.addEventListener('click', function() {
        const dataUrl = 'http://127.0.0.1:7000/userInfo/';  // JSON 데이터를 가져올 API URL
        fetch(dataUrl)
            .then(response => response.json())
            .then(data => {
                const tableBody = document.querySelector('#data-table tbody');
                tableBody.innerHTML = ''; // 테이블을 초기화합니다.

                data.forEach(item => {

                    const row = document.createElement('tr');

                    const numCell = document.createElement('td');
                    numCell.textContent = item.학번;
                    row.appendChild(numCell);
                    
                    const bookCell = document.createElement('td');
                    bookCell.textContent = item.도서명;
                    row.appendChild(bookCell);
                    
                    const dateCell = document.createElement('td');
                    dateCell.textContent = item.대출신청일;
                    row.appendChild(dateCell);

                    const codeCell = document.createElement('td');
                    codeCell.textContent = item.청구기호;
                    row.appendChild(codeCell);

                    const addressCell = document.createElement('td');
                    addressCell.textContent = item.신청승인;
                    row.appendChild(addressCell);

                    const locationCell = document.createElement('td');
                    locationCell.textContent = item.수령처;
                    row.appendChild(locationCell);

                    tableBody.appendChild(row);
                });

                table.style.display = 'table'; // 테이블을 표시합니다.
            })
            .catch(error => {
               
                console.error('Error fetching the data:', error);
            });
    });

    memberForm.addEventListener('submit', function(event) {

        event.preventDefault()

        const memberId = document.getElementById('memberId').value.trim();

        // 입력값이 없는 경우 경고
        if (!memberId) {
            alert('학번을 입력해주세요.');
            return;
        }

        const dataUrl = `http://127.0.0.1:7000/userInfo_get/?memberId=${encodeURIComponent(memberId)}`;
        // userinfo_get이런이름은 백앤드랑

        console.log(dataUrl)

        fetch(dataUrl)
            .then(response => response.json())
            .then(data => {
                const tableBody = document.querySelector('#data-table tbody');
                tableBody.innerHTML = ''; // 테이블을 초기화합니다.

                console.log(data)

                data.forEach(item => {

                    const row = document.createElement('tr');

                    const numCell = document.createElement('td');
                    numCell.textContent = item.학번;
                    row.appendChild(numCell);
                    
                    const bookCell = document.createElement('td');
                    bookCell.textContent = item.도서명;
                    row.appendChild(bookCell);
                    
                    const dateCell = document.createElement('td');
                    dateCell.textContent = item.대출신청일;
                    row.appendChild(dateCell);

                    const codeCell = document.createElement('td');
                    codeCell.textContent = item.청구기호;
                    row.appendChild(codeCell);

                    const addressCell = document.createElement('td');
                    addressCell.textContent = item.신청승인;
                    row.appendChild(addressCell);

                    const locationCell = document.createElement('td');
                    locationCell.textContent = item.수령처;
                    row.appendChild(locationCell);
                    
                    tableBody.appendChild(row);
                });

                table.style.display = 'table'; // 테이블을 표시합니다.
            })
            .catch(error => {
               
                console.error('Error fetching the data:', error);
            });
    });
});
