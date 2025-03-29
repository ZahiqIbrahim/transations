const corsProxy = "https://api.allorigins.win/raw?url=";
const allTransactionsApi = "https://koul-network-ipfs.onrender.com/transactions";
const searchTransactionApi = "https://koul-network-ipfs.onrender.com/transaction/";

async function fetchAllTransactions() {
    try {
        const fullUrl = allTransactionsApi;
        const response = await fetch(fullUrl);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        displayTransactions(data);
    } catch (error) {
        console.error("Error fetching transactions:", error);
        alert("Failed to fetch transactions.");
    }
}

async function searchTransaction() {
    const txnId = document.getElementById("searchInput").value.trim();
    if (!txnId) {
        alert("Please enter a Transaction ID.");
        return;
    }
    document.getElementById("loading").style.display = "block";
    try {
        const fullUrl = corsProxy + encodeURIComponent(searchTransactionApi + txnId);
        const response = await fetch(fullUrl);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        displayTransactions(Array.isArray(data) ? data : [data]);
    } catch (error) {
        console.error("Error searching transaction:", error);
        alert("Transaction not found.");
    } finally {
        document.getElementById("loading").style.display = "none";
    }
}

function displayTransactions(data) {
    const tableBody = document.querySelector("#transactionTable tbody");
    tableBody.innerHTML = "";
    if (Array.isArray(data) && data.length > 0) {
        data.forEach((transaction, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${transaction.txn_id || "N/A"}</td>
                <td>${index + 1}</td>
                <td>${transaction.amount || "N/A"}</td>
                <td>${new Date(transaction.time).toLocaleString() || "N/A"}</td>
            `;
            row.addEventListener("click", () => toggleRowDetails(row, transaction));
            tableBody.appendChild(row);
        });
    } else {
        tableBody.innerHTML = `<tr><td colspan="4">No transactions found</td></tr>`;
    }
}

function toggleRowDetails(row, transaction) {
    if (row.classList.contains("expanded")) {
        row.classList.remove("expanded");
        if (row.nextElementSibling && row.nextElementSibling.classList.contains("details-row")) {
            row.nextElementSibling.remove();
        }
    } else {
        document.querySelectorAll(".expanded").forEach(expandedRow => {
            expandedRow.classList.remove("expanded");
            if (expandedRow.nextElementSibling && expandedRow.nextElementSibling.classList.contains("details-row")) {
                expandedRow.nextElementSibling.remove();
            }
        });
        row.classList.add("expanded");
        const detailsRow = document.createElement("tr");
        detailsRow.classList.add("details-row");
        detailsRow.innerHTML = `
            <td colspan="4">
                <strong>Sender:</strong> ${transaction.from_id || "N/A"} <br>
                <strong>Receiver:</strong> ${transaction.to_id || "N/A"} <br>
                <strong>Hash:</strong> ${transaction.hash || "N/A"} <br>
                <strong>Previous Hash:</strong> ${transaction.previous_hash || "N/A"}
            </td>
        `;
        row.after(detailsRow);
    }
}
fetchAllTransactions()