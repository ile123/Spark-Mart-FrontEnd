import { Card } from 'react-bootstrap';
import styles from './RegistrationPage.module.css'
import Button from '../../UI/Button/Button';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import ErrorModal from '../../UI/ErrorModal/ErrorModal';
import { registerUser } from '../../../auth/authActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

export default function RegistrationPage() {

    const [showErrorModal, setShowErrorModal] = useState(false);
    const [formErrors, setFormErrors] = useState<string[]>([]);
    
    const { register, handleSubmit, formState: { errors }, getValues } = useForm();

    async function submitForm(data: any) {
        const submitData = {
            firstName: data.firstName,
            lastName: data.lastName,
            phoneNumber: data.phoneNumber,
            email: data.email.toLowerCase(),
            password: data.password,
            role: "CUSTOMER"
        };
        await axios.post("http://localhost:8080/spark-mart/api/auth/emailExists", { email: data.email })
        .then((response: any) => {
            if(response.data === true) {
                setFormErrors(["ERROR: Email already in use!"]);
                setShowErrorModal(true);
            } else {
                //@ts-ignore
                dispatch(registerUser(submitData));
                navigate("/login");
            }
        })
        .catch((error: any) => console.log(error));;
    }

    const handleError = (errors: any) => {
        const errorsArray:string[] = [];
        {Object.values(errors).map( (e: any) => {
            errorsArray.push(e.message);
        })}
        setFormErrors(errorsArray);
        setShowErrorModal(true);
    };

    const errorHandler = () => {
        setFormErrors([]);
        setShowErrorModal(false);
    }

    const { loading, userInfo, success, error } = useSelector(
        (state: any) => state.auth
    );
    
    const dispatch = useDispatch();

    const navigate = useNavigate();

    useEffect(() => {
        if (JSON.stringify(userInfo) !== '{}') navigate('/');
    }, [navigate, userInfo, success]);

    return(
        <>
        {showErrorModal && (
        <ErrorModal
          errors={formErrors}
          onConfirm={errorHandler}
        />)}
        <form onSubmit={handleSubmit(submitForm, handleError)}>
            <Card id={styles.card}>
                <Card.Title id={styles.pageName}>REGISTER</Card.Title>
                <Card.Body>
                    <h3 className={styles.label}>Email</h3>
                    <input type="email" className={styles.input} placeholder='Enter email....' autoComplete={"off"} {...register('email', { 
                        required: {
                            value: true,
                            message: "ERROR: Email is required!"
                        },
                        pattern: {
                            value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
                            message: "ERROR: Invalid email!"
                        } })}
                    />
                    <h3 className={styles.label}>Phone Number</h3>
                    <input type="text" className={styles.input} placeholder='Enter phone number...' {...register("phoneNumber", { 
                       required: {
                            value: true,
                            message: "ERROR: Phone Number is required!"
                       }, pattern: {
                            value: /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g,
                            message: "ERROR: Invalid phone number!"
                       } 
                       })} />
                    <div className='row'>
                        <div className='col'>
                            <h3 className={styles.label}>First Name</h3>
                            <input type="text" className={styles.input} placeholder='Enter first name...' {...register("firstName", { 
                                required: {
                                    value: true,
                                    message: "ERROR: You must specify your first name!"
                                }, 
                                pattern: {
                                    value: /^[a-zA-Z]+$/,
                                    message: "ERROR: Invalid first name!"
                                } })} />
                        </div>
                        <div className='col'>
                            <h3 className={styles.label}>Last Name</h3>
                            <input type="text" className={styles.input} placeholder='Enter last name...' {...register("lastName", { 
                                required: {
                                    value: true,
                                    message: "ERROR: You must specify your last name!"
                                }, 
                                pattern: {
                                    value: /^[a-zA-Z]+$/,
                                    message: "ERROR: Invalid last name!"
                                }
                             })} />
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col'>
                            <h3 className={styles.label}>Password</h3>
                            <input type="password" className={styles.input} placeholder='Enter password...' {...register("password", { 
                                required: {
                                    value: true,
                                    message: "ERROR: Password is required!"
                                }, pattern: {
                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
                                    message: "ERROR: Invalid password(It needs to contain 1 upper case letter, 1 lower case letter and a number, also min. lenght is 8)!"
                                }
                            })}/>
                        </div>
                        <div className='col'>
                            <h3 className={styles.label}>Repeat Password</h3>
                            <input type="password" className={styles.input} placeholder='Repeat password...' {...register("repeatPassword", {
                                validate: (match) => {
                                    const password = getValues("password")
                                    return match === password || "ERROR: Passwords should match!"
                                },
                                required: {
                                    value: true,
                                    message: "ERROR: Repeat password is required!"
                                }
                            })}/>
                        </div>
                    </div>
                    <Button style={styles.button} type={"submit"}>{loading ? <FontAwesomeIcon icon={faCog} pulse size="lg" />  : "Register" }</Button>
                </Card.Body>
            </Card>
        </form>
        </>
    );
}

//{loading ? <FontAwesomeIcon icon="fa-duotone fa-gear" spinPulse /> : "Register"}