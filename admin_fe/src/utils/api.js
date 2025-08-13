import axios from 'axios';
const BASE_URL = process.env.REACT_APP_BASE_URL;

export const fetchDataFromApi = async (url) => {
    try {
        const { data } = await axios.get(BASE_URL + url);
        return data;
    } catch (error) {
        console.log(error);
        return error;
    }
};

export const postData = async (url, formData) => {
    const { data } = await axios.post(BASE_URL + url, formData);
    return data;
};

export const editData = async (url, updatedData) => {
    const { data } = await axios.put(BASE_URL + url, updatedData);
    return data;
};

export const deleteData = async (url, id) => {
    const { data } = await axios.delete(BASE_URL + url + id);
    return data;
};
