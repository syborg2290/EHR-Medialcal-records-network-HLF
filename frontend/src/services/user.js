import swal from "sweetalert";

const axios = require("axios");

export const authenticate = () => {
  axios
    .post("http://localhost:4000/user/register", {
      username: this.state.username,
      password: pwd,
    })
    .then((res) => {
      //   localStorage.setItem("token", res.data.token);
      //   localStorage.setItem("user_id", res.data.id);
    })
    .catch((err) => {
      if (err.response && err.response.data && err.response.data.errorMessage) {
        swal({
          text: err.response,
          icon: "error",
          type: "error",
        });
      }
    });
};
