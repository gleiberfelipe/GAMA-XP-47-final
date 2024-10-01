import { useSelector, useDispatch } from "react-redux";
import { addToCart, decreaseCart, removeFromCart, clearCart, } from "../../store/modules/cart";
import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { Header } from "../../components/header";
import { RootState } from "../../store";
import Footer from "../../components/footer";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import { DivMasterCart } from "./style";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InternalProvider from "../../components/ContextProvider/ContextProvider";
import { Wallet } from "@mercadopago/sdk-react";
import { initMercadoPago } from "@mercadopago/sdk-react";
import { useUser } from "@clerk/clerk-react";

interface Produto {
  id: number;
  nome: string;
  foto: string;
  descricao: string;
  preco: number;
  categoria: string;
}

function CartPage() {
  const [coupon, setCoupon] = useState("");

  const cart = useSelector((state: any) => state.cart);
  const token = useSelector((state: any) => state.user.token || '');
  const dispatch = useDispatch();
  const [products, setProducts] = useState<Produto[]>([]);
  const [preferenceId, setPreferenceId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [orderData, setOrderData] = useState({ quantity: "1", price: "10", amount: 10, description: "Some book" });
  const [isReady, setIsReady] = useState(false);
  const navigate = useNavigate();
  const { user } = useUser();

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
    const fetchProducts = async () => {
      const productIds = cart.cartItems.map((item) => item.id);
      const result = await api.get(
        `https://admin-beige-zeta.vercel.app/api/products?ids=${productIds.join(",")}`
      );
      setProducts(result.data);
    };
    if (cart.cartItems.length > 0) {
      fetchProducts();
    }
  }, [cart]);


  async function handleCheckout(coupon: string | undefined) {
    await sendCartData(cart, token, coupon);


  }


  

  /* user?.firstName
    {user?.emailAddresses[0].emailAddress
    user?.imageUrl */

  const session = {
    clerkId: user?.id,
    name: user?.firstName,
    email: user?.emailAddresses[0].emailAddress,
  }


  const handleCheckoutNew = async () => {
    try {
   /*    if (!user) {
        navigate.push("sign-in");
      } else { */
        const res = await fetch(`http://localhost:3000/api/checkout`, {
          method: "POST",
          body: JSON.stringify({cartItems: cart.cartItems, session, cart}),
          headers: {"Content-Type": "application/json"},
        })
       
       
   /*      await new Promise(resolve => setTimeout(resolve, 2000)); */

        // Converter a resposta em JSON
        const data = await res.json();

        navigate(`/checkout/${data}`); 
        

        
        // Imprimir os dados no console
        console.log(data);
      
    } catch (err) {
      console.log("[checkout_POST]", err);
    }
  };

  function Checkout() {
    const location = useLocation();
    const orderId = new URLSearchParams(location.search).get('id');
  }

  async function sendCartData(cart: RootState["cart"], token: string, coupon?: string) {
    let requestBody = {
      listaprodutos: cart.cartItems.map(item => {
        return { idproduto: item.id, quantidade: item.cartQuantity };
      }),
    };



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
        .catch((error) => {
          console.error(error);
        }).finally(() => {
          setIsLoading(false);
        })
      console.log(response);
    } catch (error) {
      console.log(error.response.data);
      toast.error('É preciso logar pra fazer checkout');
    }
  };



  const handleIncrease = (product) => {
    const item = cart.cartItems.find((i) => i.id === product.id);

    if (item) {
      dispatch(addToCart({ ...product, selectedColorIndex: item.optionIndex }));
    } else {
      dispatch(addToCart({ ...product, selectedColorIndex: 0 }));
    }

  
  };
  
  
 

  function handleDecrease(product) {
    const item = cart.cartItems.find((item) => item.id === product.id);
    if (item.cartQuantity > 1) {
      dispatch(decreaseCart(product));
    }
  }

  function handleRemove(product) {
    dispatch(removeFromCart(product));
  }

  function handleClearCart() {
    dispatch(clearCart());
  }

  function getProductPrice(id: number): number {
    const product = products.find((p) => p.id === id);
    if (product) {
      return product.price;
    }
    return 0;
  }

  function getProductTotalPrice(id: number): number {
    const item = cart.cartItems.find((i) => i.id === id);
    if (item) {
      return item.cartQuantity * getProductPrice(id);
    }
    return 0;
  }
  function getProductOption(id: number): number {
    const item = cart.cartItems.find((i) => i.id === id);
    if (item) {
      return item.option;
    }
    return 0;
  }


  const [couponError, setCouponError] = useState(null);
  const [couponDetails, setCouponDetails] = useState(null);

  async function handleVerifyCoupon(coupon: string) {
    event?.preventDefault();

    try {
      const response = await api.get(`http://localhost:3000/cupons?nome=${coupon}`);

      if (response.status === 200 && Array.isArray(response.data) && response.data.length > 0 && response.data.some(item => item.nome === coupon)) {
        console.log("Coupon found");
        setCouponError(null);
        setCouponDetails(response.data.find(item => item.nome === coupon)); // Set the coupon details state with the matching item from the response array
      } else {
        console.log("Coupon not found");
        setCouponError("Cupom não encontrado");
        setCouponDetails(null); // Reset the coupon details state to null if the coupon is invalid
      }
    } catch (error) {
      console.log(error);
      setCouponError("Error verifying coupon");
      setCouponDetails(null); // Reset the coupon details state to null if there's an error
    }
  };






  return (
    <>
      <InternalProvider context={{ preferenceId, isLoading, orderData, setOrderData }}>
        <Header />
        <DivMasterCart>
          <h1>Carrinho</h1>
          {cart.cartItems.length === 0 ? (
            <section>
              <p>Seu carrinho está vazio!</p>
              <NavLink to="/products" ><button> Voltar a Loja</button></NavLink>
            </section>
          ) : (
            <div>
              <table>
                <thead>
                  <tr>
                    <th>Foto</th>
                    <th>Variação</th>
                    <th>Produto</th>
                    <th>Preço unitário</th>
                    <th>Quantidade</th>
                    <th>Total parcial</th>
                    <th>Remover</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.cartItems.map((item) => {
                    const product = products.find((p) => p.id === item.id);
                    if (!product) return null;
                    const unitPrice = getProductPrice(item.id);
                    const totalProductPrice = getProductTotalPrice(item.id);
                    const option = getProductOption(item.id);
                    return (

                      <tr key={product.id}>
                        <td><img src={product.media} alt="" /></td>
                        <td>{option}</td>
                        <td>{product.title}</td>
                        <td>R${unitPrice}</td>
                        <td>
                          <button onClick={() => handleDecrease(product)}>
                            -
                          </button>
                          {item.cartQuantity}
                          <button onClick={() => handleIncrease(product)}>
                            +
                          </button>
                        </td>
                        <td>R${totalProductPrice}</td>
                        <td>
                          <button onClick={() => handleRemove(product)}>X</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="4" className="total">
                      Quantidade de produtos: {cart.cartTotalQuantity} | Valor total: R$
                      {cart.cartTotalAmount}
                    </td>
                  </tr>
                </tfoot>
              </table>
              <form>
                <label>
                  Código do cupom:
                  <input
                    type="text"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                  />
                </label>
                <button type="button" onClick={() => handleVerifyCoupon(coupon)}>
                  Verificar
                </button>
                {couponDetails && (
                  <div>
                    <p className="rightCupom"> Cupom aplicado! Desconto de {couponDetails.desconto} {couponDetails.descontoporcentagem ? '%' : '.00 reais'}</p>
                  </div>
                )}
                {couponError && <p>{couponError}</p>}
              </form>



              <div className="keep-shopping">
                <button onClick={handleClearCart}>Limpar carinho</button>
                <NavLink to="/products"> <button>Continuar Comprando</button></NavLink>
                <button onClick={() => /* handleCheckout(coupon) */ handleCheckoutNew()}>Check out</button>
                <div style={{ width: "50px", height: "50px", backgroundColor: "black" }}>
                  {renderCheckoutButton(preferenceId)}
                </div>

              </div>
            </div>
          )}
        </DivMasterCart>
        <Footer />
        <ToastContainer />
      </InternalProvider>
    </>
  );
}

export default CartPage;
