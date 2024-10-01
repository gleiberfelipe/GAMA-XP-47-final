import { Header } from "../../components/header";
import Footer from "../../components/footer";
import { useEffect } from "react";
import { useLocation } from 'react-router-dom';
import { useState } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { CheckouDiv, CheckoutPage } from "./style";
import { useParams } from "react-router-dom";
import { RootState } from "../../store";
import InternalProvider from "../../components/ContextProvider/ContextProvider";
import { Wallet } from "@mercadopago/sdk-react";
import { initMercadoPago } from "@mercadopago/sdk-react";

interface Pedido {
    id: number;
    usuario_id: number;
    valor: number;
    cupom: string | null;
    createdAt: string;
    updatedAt: string;
    Produtos: Produto[];
}

interface Produto {
    id: number;
    nome: string;
    foto: string;
    preco: number;
    descricao: string;
    categoria: number;
    createdAt: string;
    updatedAt: string;
    DetalhesPedido: DetalhesPedido;
}

interface DetalhesPedido {
    pedido_id: number;
    produto_id: number;
    quantidade: number;
    createdAt: string;
    updatedAt: string;
}

export default function CheckOut() {

    const location = useLocation();
    const pedidoId = new URLSearchParams(location.search).get("id");
    const token = useSelector((state: any) => state.user.token || '');
    const { orderId } = useParams<{ orderId: string }>();
    const [preferenceId, setPreferenceId] = useState(null);
    const [orderData, setOrderData] = useState([]);

    const [order, setOrder] = useState<Pedido | null>(null);
    console.log(orderId);

    
    
        useEffect(() => {
          initMercadoPago("TEST-f4e6fea0-5be7-4298-b49d-250b96af56dd", { locale: 'pt-BR' });
        }, []);

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

    const renderCheckoutButton = (preferenceId) => {
        if (!preferenceId) return null;

        return (
            <Wallet
                initialization={{ preferenceId: preferenceId }}
                onReady={handleOnReady} />
        )
    }
    const handleOnReady = () => {
        setIsReady(true);
    }


     useEffect(() => {
     async function sendOrderData() {
            if (order) {
                const formattedOrderData = {
                    items: order?.orderDetails?.products?.map((info) => ({
                        id: info.product._id,
                        title: info.product.title,
                        quantity: parseInt(info.quantity, 10),
                        unit_price: parseFloat(info.product.price),
                        description: info.product.description
                    })),
                    payer: {
                        first_name: order?.customer?.firstName,
                        last_name: order?.customer?.lastName,
                        email: order?.customer?.clerkId,
                        identification: { number: order?.orderDetails?._id, type: '' },
                    },
                    amount: order?.orderDetails?.products?.reduce((total, info) => 
                        total + (parseInt(info.quantity, 10) * parseFloat(info.product.price)), 0
                    ),
                };
                setOrderData(formattedOrderData);
                console.log(formattedOrderData);
                sendCartData();
            }
        }

        sendOrderData();
 
    }, [order]);
    
        async function sendCartData(/* cart: RootState["cart"], token: string, coupon?: string */) {
            /*    let requestBody = {
                   listaprodutos: cart.cartItems.map(item => {
                       return { idproduto: item.id, quantidade: item.cartQuantity };
                   }),
               }; */



            try {
                const response = await fetch("http://localhost:8080/create_preference", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(orderData),
                })
                    .then((response) => {
                        return response.json();
                    })
                    .then((preference) => {
                        setPreferenceId(preference.id);
                    })
                  
                console.log(response);
            } catch (error) {
                console.log(error.response.data);
                toast.error('É preciso logar pra fazer checkout');
            }
        };
        
   
    // render the checkout page with order data
    return (
        <>
            <InternalProvider context={{ preferenceId, orderData, setOrderData }}>
                <Header />
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
                        {renderCheckoutButton(preferenceId)}
                    </div>

                </CheckoutPage>
                <Footer />
            </InternalProvider>
        </>
    );
}
