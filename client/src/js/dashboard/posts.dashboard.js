import { 
    getElements, 
    getElement, 
    deleteData, 
    pagination } from '../utils/utils.js';
import { posts as selectors } from '../lib/selectors.js';


const confirmTarget = target => target.className === 'btn__delete'; 
const deletePost = async e => {
    const target = e.target;

    if (!confirmTarget(target)) return;

    const row = target.parentElement.parentElement;
    const updateUI = await deleteActualPost(row);
    updateUI(row);

};

const deleteActualPost = async (row) => {
    const url = row.querySelector(selectors.btnDelete).value;

    try {
        const response = await deleteData(url);
        
        if (response.status !== 200) 
            throw response;

        return element => element.remove();

    } catch(err) {
        console.error(err);
        return () => console.warn('an error has occurred while fetching data.');
    }
};

getElement(selectors.postList).addEventListener('click', deletePost);

pagination();