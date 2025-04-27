export const columns = [
    {
        name: "Product ID",
        selector: (row) => row._id
    },
    {
        name: "Product Name",
        selector: (row) => row.name
    },
    {
        name: "Received From",
        selector: (row) => row.email
    },
    {
        name: "Quantity Received",
        selector: (row) => row.quantity
    },
    {
        name: "Received Date",
        selector: (row) => row.date
    },
   
]

export const WarehouseButtons = () =>{
    return(
        <div>
            <button>Edit</button>
            <button>Delete</button>
        </div>
    )

}