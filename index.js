const corsProxy = "https://api.allorigins.win/raw?url=";
const allTransactionsApi = "https://koul-network-ipfs.onrender.com/transactions";
const searchApiUrl = "https://koul-network-ipfs.onrender.com/transaction/";

// Function to fetch all transactions
async function fetchAllTransactions() {
    try {
        const fullUrl = corsProxy + encodeURIComponent(allTransactionsApi);
        console.log("Fetching all transactions:", fullUrl);

        const response = await fetch(fullUrl);
        console.log("Response Status:", response.status);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("All Transactions API Response:", data);

        const tableBody = document.querySelector("#transactionTable tbody");
        tableBody.innerHTML = "";

        if (Array.isArray(data) && data.length > 0) {
            data.forEach(transaction => {
                const row = `<tr>
                    <td>${transaction.txn_id || "N/A"}</td>
                    <td>${transaction.from_id || "N/A"}</td>
                    <td>${transaction.to_id || "N/A"}</td>
                    <td>${transaction.amount || "N/A"}</td>
                    <td>${new Date(transaction.time).toLocaleString() || "N/A"}</td>
                </tr>`;
                tableBody.innerHTML += row;
            });
        } else {
            tableBody.innerHTML = `<tr><td colspan="5">No transactions found</td></tr>`;
        }
    } catch (error) {
        console.error("Error fetching all transactions:", error);
        alert("Failed to fetch transactions.");
    }
}

// Function to search for a transaction by ID
async function searchTransaction() {
    const txnId = document.getElementById("searchInput").value.trim();
    if (!txnId) {
        alert("Please enter a Transaction ID.");
        return;
    }

    try {
        const fullUrl = corsProxy + encodeURIComponent(searchApiUrl + txnId);
        console.log("Fetching:", fullUrl);

        const response = await fetch(fullUrl);
        console.log("Response Status:", response.status);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Search API Response:", data);

        const tableBody = document.querySelector("#transactionTable tbody");
        tableBody.innerHTML = "";

        if (Array.isArray(data) && data.length > 0) {
            const transaction = data[0];  
            const row = `<tr>
                <td>${transaction.txn_id || "N/A"}</td>
                <td>${transaction.from_id || "N/A"}</td>
                <td>${transaction.to_id || "N/A"}</td>
                <td>${transaction.amount || "N/A"}</td>
                <td>${new Date(transaction.time).toLocaleString() || "N/A"}</td>
            </tr>`;
            tableBody.innerHTML = row;
        } else {
            tableBody.innerHTML = `<tr><td colspan="5">Transaction not found</td></tr>`;
        }
    } catch (error) {
        console.error("Error fetching transaction:", error);
        alert("Transaction not found or an error occurred.");
    }
}

// Fetch all transactions when the page loads
fetchAllTransactions();