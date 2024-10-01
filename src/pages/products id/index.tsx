import { useParams } from "react-router-dom";
import { api } from "../../services/api";
import React, { useState, useEffect } from "react";
import { Header } from "../../components/header";
import Footer from "../../components/footer";
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/modules/cart";
import { DivMaster } from "./style";
import { FotoProductDiv, LoadingMessage, ErrorMessage } from "./style";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


interface Produto {
  nome: string;
  foto: string;
  descricao: string;
  preco: number;
  categoria: string;
  // add any other properties you want to include in the product object
}

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Produto | null>(null);
  const [fetchError, setFetchError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [imageArray, setImageArray] = useState(0);
  const dispatch = useDispatch();

  const handleColorChange = (event) => {
    setSelectedColorIndex(event.target.value);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const result = await api.get(`https://admin-beige-zeta.vercel.app/api/products/${productId}`, {
          method: 'GET'
        });
        setProduct(result.data);
        setIsLoading(false);
      } catch (error) {
        setFetchError(true);
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleAddToCart = () => {
    if (product) {
      const productWithSelectedColor = { 
        ...product, 
        selectedColorIndex 
      };
      dispatch(addToCart(productWithSelectedColor));
      toast.success('Produto adicionado ao carrinho!');
    }
  };
  
  const handleImageArray = (number:any) =>{

    setImageArray(number)
  }
  

  if (isLoading) {
    return (
      <>
        <Header />
        <LoadingMessage>Loading...</LoadingMessage>
        <Footer />
      </>
    );
  }

  if (fetchError) {
    return (
      <>
        <Header />
        <ErrorMessage>Falha ao carregar produto</ErrorMessage>
        <Footer />
      </>
    );
  }



  return (
    <>
      <Header />
      <ToastContainer />
      <DivMaster>
      <FotoProductDiv>
  <div className="thumbnails">
    <img 
      src={Array.isArray(product.media) && product.media.length >= 1 ? product.media[0] : null} 
      alt={product.nome} 
      onClick={() =>  handleImageArray(0)} 
    />
    <img 
      src={Array.isArray(product.media) && product.media.length >= 2 ? product.media[1] : null} 
      alt={product.nome} 
      onClick={() => Array.isArray(product.media) && product.media.length >= 2 ? handleImageArray(1): null} 
    />
    <img 
      src={Array.isArray(product.media) && product.media.length >= 3 ? product.media[2] : null} 
      alt={product.nome} 
      onClick={() => Array.isArray(product.media) && product.media.length >= 3 ? handleImageArray(2) : null} 
    />
  </div>
  <img 
    className="main-photo" 
    src={Array.isArray(product.media) && product.media.length > 0 ? product.media[imageArray] : null} 
    alt={product.title} 
  />
</FotoProductDiv>

        <div className="infoDiv">
          <h2>{product.title}</h2>
          <p>
            Detalhes do produto: 
            {product.description}
          </p>
          {product.colors && product.colors.length > 0 && (
        <select value={selectedColorIndex} onChange={handleColorChange}>
          {/* Mapeia as cores disponíveis e cria uma opção para cada uma */}
          {product.colors.map((color, index) => (
            <option key={index} value={index}>{color}</option>
          ))}
        </select>
      )}
          <div className="priceDiv">  
            <h3>R$ {product.price},00</h3>
            {/* add any other product details you want to display */}
            <button onClick={handleAddToCart}>POR NO CARINHO</button>
          </div>
        </div>
      </DivMaster>
      <Footer />
    </>
  );
};

export default ProductDetail;
