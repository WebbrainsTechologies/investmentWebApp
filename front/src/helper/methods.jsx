import moment from "moment";
// import CryptoJS from "crypto-js";
export const randomUUID = () => {
  return (
    Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1) +
    Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1)
  );
};

export const subtaskTicket = () => {
  return (
    "#" +
    Math.floor((1 + Math.random()) * 0x1000)
      .toString(16)
      .substring(1) +
    Math.floor((1 + Math.random()) * 0x1000)
      .toString(16)
      .substring(1)
  );
};

export const dateFormat = date => {
  return moment(date).format("MMMM Do, h:mm a");
};

export const onlyDate = date => {
  return moment(date).format("MMM Do");
};

export const datesWithYear = date => {
  return moment(date).format("MMM Do YYYY");
};

// export const encrypted_response = (data) => {
//   return CryptoJS.AES.encrypt(
//     JSON.stringify(data),
//     "E2oWUrFBy7LAGunU48jmq48QPTU2NidFEgdbBPB1T7uvOcpbZv1SP2yJ78vS1ZOH"
//   ).toString();
// };

// export const decrypted_request = (data) => {
//   let bytes = CryptoJS.AES.decrypt(
//     data,
//     "E2oWUrFBy7LAGunU48jmq48QPTU2NidFEgdbBPB1T7uvOcpbZv1SP2yJ78vS1ZOH"
//   );
//   return bytes.toString(CryptoJS.enc.Utf8);
// };
