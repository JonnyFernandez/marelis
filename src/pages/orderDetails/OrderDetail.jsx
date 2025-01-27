import { useParams } from "react-router-dom"

const OrderDetail = () => {
    const { id } = useParams()

    return (
        <>
            <h1>{id}</h1>
        </>
    )
}

export default OrderDetail