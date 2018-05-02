import createStore from 'redux-zero';
import axios from 'axios';

const store = createStore({ results: [], deviceId: '', specials: [], loadingSpecials: false });

const mapToProps = ({ results, deviceId, specials, loadingSpecials }) => ({ results, deviceId, specials, loadingSpecials });

const actions = ({ setState }) => ({
    getResults(state, value) {
        return axios.post(
            'http://workshop-ava.azurewebsites.net/api/Camera/RecognizeImage', 
            value
        )
        .then(response => {
            var data = JSON.parse(response.data);
            var product = data.Products[0];
            var result = {
                name: product.Name,
                description: product.Products[0].FullDescription,
                price: product.Products[0].Price
            };
            var results = state.results.concat([{
                image: value,
                product: result
            }]);
            return { results: results }
        })
        .catch(error => {
            var results = state.results.concat([{
                image: value,
                product: null
            }]);
            return { results: results, deviceId: state.deviceId };
        })
    },
    setDeviceId(state, value) { return { results: state.results, deviceId: value } },
    getSpecials() {
        setState({ specials: [], loadingSpecials: true });
        return axios.get('https://testavagoapi.azurewebsites.net/api/deals')
        .then(response => {
            var specials = response.data.map(function(item, index) {
                return {
                    name: item.name,
                    description: "",
                    price: item.originalPrice,
                    discountPrice: item.discountPrice,
                    image: item.imageUrl
                };
            });
            return { specials: specials, loadingSpecials: false };
        })
        .catch(error => {
            return { specials: [], loadingSpecials: false };
        })
    }  
});

export { store, mapToProps, actions };
