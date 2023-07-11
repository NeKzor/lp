// added by a non react dev. there might be a better way to do this.
const baseUrl = () => {
    return process.env.REACT_APP_BASE_URL ?? "https://lp.nekz.me"
};

export default baseUrl;
