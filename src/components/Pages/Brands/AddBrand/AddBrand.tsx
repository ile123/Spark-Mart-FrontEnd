import { Card } from "react-bootstrap";
import styles from "./AddBrand.module.css";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Errors } from "../../../../types/Errors";
import { useNavigate } from "react-router-dom";
import ErrorModal from "../../../UI/ErrorModal/ErrorModal";
import Button from "../../../UI/Button/Button";
import { createNewBrand } from "../../../../services/brand-Service";

export default function AddBrand() {
  const navigate = useNavigate();

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [formErrors, setFormErrors] = useState<Errors>();
  const [imageData, setImageData] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm();

  const handleImageUpload = (event: any) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64String: any = reader.result;
      setImageData(base64String);
    };

    reader.readAsDataURL(file);
  };

  async function submitForm(data: any) {
    const params = {
        name: data.name,
        image: data.image[0]
    }
    createNewBrand(params);
    navigate("/brands");
  }

  const handleError = (errors: any) => {
    const errorsArray: Errors = [];
    {
      Object.values(errors).map((e: any) => {
        errorsArray.push(e.message);
      });
    }
    setFormErrors(errorsArray);
    setShowErrorModal(true);
  };

  const errorHandler = () => {
    setFormErrors([]);
    setShowErrorModal(false);
  };

  return (
    <>
      {showErrorModal && (
        <ErrorModal errors={formErrors} onConfirm={errorHandler} />
      )}
      <form onSubmit={handleSubmit(submitForm, handleError)}>
        <Card id={styles.card}>
          <Card.Header id={styles.header}>Add New Brand</Card.Header>
          <Card.Body>
            <h3 className={styles.label}>Name: </h3>
            <input type="text" className={styles.input} {...register("name", {
                required: {
                    value: true,
                    message: "ERROR: Name is required!"
                },
                pattern: {
                    value: /^[a-zA-Z\s-]+$/,
                    message: "ERROR: Invalid name!",
                }
            })}/>
            <h3 className={styles.label}>Photo: </h3>
            <input type="file" accept="image/*" className={styles.input} {...register("image", {
                required: {
                    value: true,
                    message: "ERROR: Photo is required!"
                },
            })}/>
          </Card.Body>
          <Card.Footer id={styles.footer}>
            <Button style={styles.button} type={"submit"}>
              Submit
            </Button>
          </Card.Footer>
        </Card>
      </form>
    </>
  );
}