import Axios from "axios";

const fetcher = (url) => Axios.get(url).then((res) => res.data);

export default fetcher;
