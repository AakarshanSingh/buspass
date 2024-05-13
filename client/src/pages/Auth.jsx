import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Loader } from '../components';
import { toast } from 'react-toastify';
import { useAppContext } from '../context/AppContext';

const imgUrl =
  'https://img.freepik.com/free-vector/forgot-password-concept-illustration_114360-1010.jpg?w=740&t=st=1710164733~exp=1710165333~hmac=b443c9732e6450fdfe2ef365f41495bc825323b51c929356ffd6817156386af3';

const FormContainer = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 1rem;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  width: 60vw;
  border-radius: 14px;
`;
const FormContainerImage = styled.div`
  img {
    width: 100%;
    object-position: center;
  }
`;
const Form = styled.form`
  display: block;
  margin: auto;
  width: 300px;
`;

const Heading = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  font-weight: 600;
`;
const Input = styled.input`
  width: 90%;
  height: 1.5rem;
  border: 1px solid var(--border-primary);
  background-color: var(--input);
  border-radius: 4px;
  margin: 5px 0;
  padding: 10px 5%;
`;

const StyledLink = styled(Link)`
  color: black;
  text-decoration: none;
  font-size: 0.875rem;
  &:hover {
    text-decoration: underline;
  }
`;

const Button = styled.button`
  width: 100%;
  margin: 1rem 0;
  margin-top: 2rem;
  height: 2.5rem;
  background-color: rgb(221, 20, 50);
  color: #ffffff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    border: 2px rgb(250, 210, 36);
  }
`;

const ImageChoose = styled.div`
  cursor: pointer;
  width: 60px;
  height: 60px;
  border: 1px solid var(--border-primary);
  background-color: var(--input);
  color: grey;
  font-size: 14px;
  margin: 1rem 0;
  border-radius: 50%;
`;
const Imagesection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  p {
    color: grey;
    font-size: 14px;
  }
`;
const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [registerInputs, setRegisterInputs] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const imageRef = useRef(null);

  const { setAuthUser, usePreviewImage, authUser } = useAppContext();

  const navigate = useNavigate();

  useEffect(() => {
    if (authUser) {
      setTimeout(() => navigate('/dashboard'), 0);
    }
  }, [authUser, navigate]);

  let { handleImageChange, profileUrl, setProfileUrl, selectedFile } =
    usePreviewImage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      if (!email || !password) {
        toast.error('Please enter all the values');
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(
          `/api/login`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
            credentials: 'include',
          }
        );
        const data = await res.json();

        if (data.error) {
          throw new Error(data.error);
        }

        localStorage.setItem('buspass', JSON.stringify(data));

        setAuthUser(data);
        toast.success(data.msg);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    } else {
      if (
        !registerInputs.name ||
        !registerInputs.email ||
        !registerInputs.password ||
        !registerInputs.confirmPassword ||
        !profileUrl
      ) {
        toast.error('Please enter all values');
        return;
      }
      if (registerInputs.password !== registerInputs.confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }
      // if (password.length < 6) {
      //   toast.error('Password must be greater than 6');
      //   return;
      // }

      setLoading(true);
      try {
        const res = await fetch(
          `/api/register`,
          {
            method: 'post',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({
              name: registerInputs.name,
              email: registerInputs.email,
              password: registerInputs.password,
              confirmPassword: registerInputs.confirmPassword,
              imgUrl: '',
            }),
          }
        );

        const data = await res.json();
        if (data.error) {
          throw new Error(data.error);
        }

        setProfileUrl('');
        localStorage.setItem('buspass', JSON.stringify(data));
        toast.success(data.msg);
        setAuthUser(data);
      } catch (error) {
        toast.error(error.message);
      }
      setLoading(false);
    }
  };

  return (
    <>
      <FormContainer>
        <FormContainerImage>
          <img src={imgUrl} alt="" />
        </FormContainerImage>
        <Form onSubmit={handleSubmit}>
          <Heading>{isLogin ? 'Sign in ' : 'Create your account'}</Heading>
          {!isLogin && (
            <Imagesection>
              <ImageChoose onClick={() => imageRef.current.click()}>
                {selectedFile ? selectedFile.name : ``}
                <input
                  type="file"
                  hidden
                  ref={imageRef}
                  onChange={handleImageChange}
                />
              </ImageChoose>
              <p>Profile</p>
            </Imagesection>
          )}
          {!isLogin && (
            <div>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={registerInputs.name}
                onChange={(e) =>
                  setRegisterInputs({
                    ...registerInputs,
                    name: e.target.value,
                  })
                }
              />
            </div>
          )}
          <div>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setRegisterInputs({
                  ...registerInputs,
                  email: e.target.value,
                });
              }}
            />
          </div>
          <div>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setRegisterInputs({
                  ...registerInputs,
                  password: e.target.value,
                });
              }}
            />
          </div>
          {!isLogin && (
            <div>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm password"
                value={registerInputs.confirmPassword}
                onChange={(e) =>
                  setRegisterInputs({
                    ...registerInputs,
                    confirmPassword: e.target.value,
                  })
                }
              />
            </div>
          )}
          <Button type="submit" disabled={loading} onClick={handleSubmit}>
            {loading ? <Loader /> : isLogin ? 'Login' : 'Register'}
          </Button>
          <StyledLink
            onClick={() => setIsLogin(!isLogin)}
            style={{
              fontSize: '0.875rem',
              color: 'var(--text-message)',
              marginTop: '0.5rem',
              display: 'inline-block',
            }}
          >
            {isLogin
              ? "Don't have an account? Register Now"
              : 'Already existing member ? Login'}
          </StyledLink>
        </Form>
      </FormContainer>
    </>
  );
};

export default Auth;
