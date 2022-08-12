import CircularProgress from "@material-ui/core/CircularProgress";
import { Box, TextField } from "@mui/material";
import { useState } from "react";
import { POST } from "../../../services/httpClient.js";
import { Navigate } from "react-router-dom";
import img1 from "../../images/logo.jpeg";
import Snackbar from "../snakebar";
import "./style.css";
const ResendVerificationEmail = () => {
  const initialValues = {
    email: "",
  };
  const [formValues, setFormValues] = useState(initialValues);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const [isloading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState(false);
  const [snakbarMessage, setsnakbarMessage] = useState(false);

  const resetForm = () => {
    setFormValues(initialValues);
  };
  const validate = (values) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!values.email) {
      setType("error");
      setsnakbarMessage("Email is Required");
      setOpen(true);
    } else if (!regex.test(values.email)) {
      setType("error");
      setsnakbarMessage("This is not a valid email format!");
      setOpen(true);
    } else return true;
  };
  const create = async (formValues) => {
    setLoading(true);
    let res = await POST("/auth/resend-verification-link", formValues);
    if (res?.code === 200) {
      setType("success");
      setOpen(true);
      setLoading(false);
      setTimeout(() => {
        setSuccess(true);
      }, 1500);
      setsnakbarMessage(res?.message);
      resetForm();
    } else {
      setType("error");
      setOpen(true);
      setLoading(false);
      setTimeout(() => {
        setSuccess(true);
      }, 1500);
      setsnakbarMessage(res?.data.message);
      resetForm();
    }
  };

  return (
    <div className="resend-container">
      <div className="resend-content-left">
        <img className="resend-img" src={img1} alt="logo of the website" />
      </div>
      <div className="resend-content-right">
        <form onSubmit={handleSubmit} className="resend">
          <h1 className="resend-h1">Resend Verification Email</h1>
          <Box sx={{ m:1, width: 550, maxWidth: "100%" }}>
            <div className="resend-inputs">
              <TextField
                label="Email"
                type="email"
                fullWidth
                name="email"
                placeholder="Enter your email"
                variant="standard"
                value={formValues.email}
                onChange={handleChange}
              />
            </div>
          </Box>
          <button
            className="resend-input-btn"
            type="submit"
            onClick={async () => {
              let validation = validate(formValues);
              if (validation) await create(formValues);
            }}
          >
            {isloading && <CircularProgress />}
            {!isloading && <span>Generate Link</span>}
          </button>
          {open && (
            <Snackbar
              open={open}
              setOpen={setOpen}
              type={type}
              message={snakbarMessage}
            />
          )}
          {success && <Navigate to={"/Login"} replace />}
        </form>
      </div>
    </div>
  );
};

export default ResendVerificationEmail;
