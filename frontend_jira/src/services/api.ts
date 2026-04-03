import axios from 'axios';
const API_URL = 'http://localhost:5000/api';

export const fetchData = async (url: any) => {
    try {
        const { data } = await axios.get(API_URL + url);
        return data;
    } catch (error) {
        console.log(error);
        return error;
    }
};

export const postData = async (url: any, formData: any) => {
    const { data } = await axios.post(API_URL + url, formData);
    return data;
};

export const editData = async (url: any, updatedData: any) => {
    const { data } = await axios.put(API_URL + url, updatedData);
    return data;
};

export const deleteData = async (url: any, id: any) => {
    const { data } = await axios.delete(API_URL + url + id);
    return data;
};
