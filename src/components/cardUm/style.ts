import styled from 'styled-components';

interface ICardBoxProps {
    backgroundColor: string;
    

}

export const CardBox = styled.div<ICardBoxProps>`

background: linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(184,181,181,0.1) 60%);
background-color: ${(props) => props.backgroundColor};
width: 25vw;
height: 170px;
margin: 10px;
border-radius:20px;
padding-left: 20px;
padding-top: 30px;
overflow: hidden;
font-family: "roboto", sans-serif;



h3{
    font-weight: 400;
    font-size: 15px;
    padding: 0;
    margin: 0;
}
h2{
    font-weight: 500;
    font-size: 35px;
    padding: 0;
    margin: 0;
}

h1{
    font-weight: 800;
    font-size: 50px;
    color: #fff;
    padding: 0;
    margin: 0;
    position: relative;
    z-index: 2;
}
img{
 width: 170px;
 height: 170px;
 position: relative;
    right: -45%;
    top: -100%;
    z-index: 1;
}


`