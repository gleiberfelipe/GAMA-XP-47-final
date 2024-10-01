import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Header } from '../../components/header';
import Footer from '../../components/footer';
import { api } from '../../services/api';
import { removeUser } from '../../store/modules/user';
import { AnyAction } from 'redux';
import { useNavigate } from 'react-router-dom';
import { UserDivMaster } from './style';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUser } from "@clerk/clerk-react";




interface IUser {
  id: number;
  nome: string;
  email: string;
  createdat: string;
}

interface UserData {
  id: number;
  nome: string;
  email: string;
  createdat: string;
}

const ProfilePage = () => {
  const [userClerk, setUserClerk] = useState<UserData>();
  /*   const isLogged = useSelector((state: any) => state.user.isLogged); */
  const userId = useSelector((state: any) => state.user.id || '');
  const token = useSelector((state: any) => state.user.token || '');
  const [fetchedUserData, setFetchedUserData] = useState<UserData>();
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [shouldReload, setShouldReload] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [showTable, setShowTable] = useState(false);




  const { isLoaded, user, isSignedIn } = useUser();
  console.log(user)

  //get user by id data
  /*  const fetchUser = async () => {
     try {
       const response = await api.get(`http://localhost:8080/api/customers/${user?.id}`, {
    
       });
   
       // Verifique se a resposta foi bem-sucedida
       if (response.status === 200) {
         // Extraia os dados do usuário da resposta
         const userData = response.data;
         setFetchedUserData(userData);
         setUserClerk(userData);
       } else {
         // Trate qualquer erro na resposta da API
         console.error("Erro ao buscar usuário:", response.statusText);
       }
     } catch (error) {
       // Capture e registre qualquer erro de solicitação
       console.error("Erro ao fazer solicitação:", error);
     }
   };
    */

  useEffect(() => {
    if (!isSignedIn) {
      // Redirect to login page if user is not logged in
      navigate('/sign-in');
    } else {
      fetchOrders()
      setShowUpdateForm(false)
      fetchOrders()
      setShowTable(showTable)
      setShowTable(true)
    }
  }, [isSignedIn, userId, shouldReload]);


  const updateUser = (id: number, nome: string, email: string): AnyAction => {
    return {
      type: 'UPDATE_USER',
      payload: { id, nome, email }
    }
  }
  // put user

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const requestBody = {};
      if (newName) {
        requestBody['nome'] = newName;
      }
      if (newEmail) {
        requestBody['email'] = newEmail;
      }
      if (newPassword) {
        requestBody['senha'] = newPassword;
      }
      const response = await api.put(
        `http://localhost:3000/usuarios/${userId}`,
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.statusText);
      toast.success("Dados atualizados")
      if (newName || newEmail) {
        // Dispatch the action to update the user in Redux store
        dispatch(updateUser(userId, newName || user?.nome || '', newEmail || user?.email || ''));
        setUser({ ...user, nome: newName, email: newEmail });
        // Fetch the user information again with the updated data
        fetchUser();
      }
      setShowUpdateForm(false);
    } catch (error) {
      console.error(error);
      toast.error("algo deu errado")
    }
  };


  //get pedidos


  const fetchOrders = () => {
    fetch(`http://localhost:3000/api/orders/customers/${user.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then((response) => response.json())
      .then((data) => {
        const reversedData = data.reverse(); // Inverte a ordem dos dados
        setOrders(reversedData); // Atualiza o estado com os dados invertidos
        console.log(reversedData); // Mostra os dados invertidos no console
        setShowTable((showTable) => !showTable); // Alterna o valor de showTable
      })
      .catch((error) => console.log(error));
  };


  // delete user

  const handleLogout = () => {
    event?.preventDefault();
    dispatch(removeUser({
      token: undefined,
      email: undefined,
      tipo: undefined,
      nome: undefined,
      id: null,
    }));
  };

  const deleteProfileButton = useRef(null);

  const handleDeleteProfile = () => {
    confirmAlert({
      title: 'Confirm to delete',
      message: 'Are you sure you want to delete your profile? This action cannot be undone.',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            api.delete(`http://localhost:3000/usuarios/${userId}`, {
              method: 'DELETE',
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              }
            })
              .then(response => {
                if (response.status = 204) {
                  toast.success("User profile deleted successfully");

                  setTimeout(() => {
                    handleLogout();
                    navigate('/login');
                  }, 3000);
                } else {
                  // Handle error response
                  console.error('Error deleting user profile');
                  toast.error('Error deleting user profile');
                }
              })
              .catch(error => {
                console.error(error);
              });
          }
        },
        {
          label: 'No',
          onClick: () => { }
        }
      ]
    });
  };

  return (
    <>
      <Header />
      <UserDivMaster>
        {user ? (
          <div>
            <div className='userInfo'>
              <h1>Nome: {user?.firstName}</h1>
              <p>Email: {user?.emailAddresses[0].emailAddress}</p>
              <img className="imgUser" src={user?.imageUrl} alt="" />
            </div>

           {/*  <button onClick={() => {
              setShowUpdateForm(!showUpdateForm);
              setShowTable(false);
            }}>Atualizar meu perfil</button> */}
            {/* <button onClick={() => {
              fetchOrders()
              setShowUpdateForm(false)
            }}>Minhas Compras</button> */}

            {/* <button ref={deleteProfileButton} id="delete-profile-button" onClick={handleDeleteProfile}>
              Delete Profile
            </button> */}
            {showUpdateForm && (
              <form onSubmit={handleSubmit}>
                <label htmlFor="name">Nome:</label>
                <input type="text" id="name" value={newName} onChange={(event) => setNewName(event.target.value)} />
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" value={newEmail} onChange={(event) => setNewEmail(event.target.value)} />
                <label htmlFor="password">Senha:</label>
                <input type="password" id="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} />
                <button /* onClick={() => {
                  fetchUser();
                 
                    setShowUpdateForm(!showUpdateForm);
                  }
                } */ type="submit">Atualizar!</button>
              </form>
            )}

            <div id="pedido-container">
              {showTable && ( // conditionally render the table HTML
                <table>
                  <thead>
                    <tr>
                      <th>Pedido ID</th>
                      <th>Cliente ID</th>
                      <th>Total da compra</th>
                      <th>Data da compra</th>
                      <th>Produtos</th>

                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td>{order._id}</td>
                        <td>{order.customerClerkId}</td>
                        <td>{order.totalAmount}</td>
                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td>
                          <table>
                            <thead>
                              <tr>
                                <th>Nome Produto</th>
                                <th>Variação</th>
                                <th>Quantidade</th>

                                <th>foto</th>
                                <th>Preço unitário</th>
                                <th>Preço parcial</th>
                              </tr>
                            </thead>
                            <tbody>
                              {order?.products?.map((produto) => (
                                  <tr key={produto?.product?._id}>
                                    <td>{produto?.product?.title}</td>
                                    <td>{produto?.color}</td>
                                    <td>{produto?.quantity}</td>
                                    <td>
                                      <img src={produto?.product?.media[0]} alt={produto?.product?.title} />
                                    </td>
                                    <td>{produto?.product?.price}</td>     
                                    <td>{produto?.product?.price * produto?.quantity}</td>
                                  </tr>
                                
                              ))}


                            </tbody>
                          </table>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <div>

            </div>
          </div>
        ) : (
          <p>Loading user information...</p>
        )}
      </UserDivMaster>
      <Footer />
      <ToastContainer />
    </>
  );


};

export default ProfilePage;
