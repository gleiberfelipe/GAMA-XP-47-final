import { Header } from "../../components/header";
import { CheckouDiv, CheckoutPage } from "./style";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { NavLink } from "react-router-dom";

interface Pedido {
    id: number;
    usuario_id: number;
    valor: number;
    cupom: string | null;
    createdAt: string;
    updatedAt: string;
    Produtos: Produto[];
}

const Feedback = () => {

    const [order, setOrder] = useState<Pedido | null>(null);
    const orderId = new URLSearchParams(location.search).get('external_reference');
    console.log(orderId);
    
    const orderIdThree = new URLSearchParams(location.search);
    console.log(orderIdThree);
    const urlParams = new URLSearchParams(window.location.search);
    const allParams: { [key: string]: string } = {};

    // Itera sobre os parâmetros e adiciona ao objeto allParams
    for (const [key, value] of urlParams.entries()) {
        allParams[key] = value;
    }

    // Captura o parâmetro 'external_reference' especificamente
    const orderId3 = allParams['external_reference'];
    
    // Log para verificação
    console.log("Parâmetro external_reference:", allParams);
    console.log("Todos os parâmetros:", orderId3);


    useEffect(() => {
        async function fetchOrderData() {
            try {
                const response = await fetch(`http://localhost:3000/api/orders/${orderId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch order data");
                }

                const data = await response.json();
                setOrder(data);
                console.log(data);
            } catch (error) {
                console.log(error);
            }
        }

        if (orderId) {
            fetchOrderData();
        }
    }, [orderId]);

    return (
        <>
            <Header />
            <h1>Store call back</h1>
            <>


                <CheckoutPage>

                    <CheckouDiv>
                        {order ? (
                            <div className="title">
                                <h1> Parabéns! Você finalizou a sua compra!</h1>
                                <h2>Detalhes do pedido:</h2>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Pedido ID</th>
                                            <th>Cliente ID</th>
                                            <th>Total do pedido</th>
                                            <th>Data da Compra</th>
                                            <th>Produtos</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{order.orderDetails._id}</td>
                                            <td>{order.customer.firstName} {order.customer.lastName}</td>
                                            <td>R${order.orderDetails.totalAmount}.00  </td>
                                            <td>{new Date(order.orderDetails.createdAt).toLocaleDateString()}</td>
                                            <td>
                                                <table>
                                                    <thead>
                                                        <tr>
                                                            <th>Nome do Produto</th>
                                                            <th>Quantidade</th>
                                                            <th>Variação</th>
                                                            <th>Foto</th>
                                                            <th>Preço Unitário</th>
                                                            <th>Preço Total</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {order?.orderDetails?.products?.map((produto) => (
                                                            <tr key={produto.product._id}>
                                                                <td>{produto.product.title}</td>

                                                                <td>{produto.quantity}</td>
                                                                <td>{produto.color}</td>
                                                                <td>
                                                                    <img src={produto.product.media} alt={produto.description} />
                                                                </td>
                                                                <td>R${produto.product.price}</td>
                                                                <td>R${produto.product.price * produto.quantity}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p>Loading...</p>
                        )}
                    </CheckouDiv>
                    <div className="botoes">
                        <NavLink to="/user"> <button>Perfil</button> </NavLink>
                        <NavLink to="/"> <button>Voltar para loja</button> </NavLink>

                    </div>

                </CheckoutPage>


            </>
        </>
    );
};

export default Feedback;
