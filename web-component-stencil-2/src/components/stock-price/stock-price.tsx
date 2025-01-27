import { h, Component, State, Element, Prop, Watch} from '@stencil/core';

import { AV_API_KEY } from '../../global/global';

@Component ({
    tag: 'nc-stock-price',
    styleUrl: './stock-price.css',
    shadow: true
})

export class StockPrice {

    stockInput: HTMLInputElement;
    // initialStockSymbol: string;

    // How to access the component itself: the host element, from inside the TS class? With the Element decorator:
    // This is in order to access the user's input:
    @Element() el: HTMLElement;
    @State() fetchedPrice: number;
    @State() stockUserInput: string;
    @State() stockInputValid = false;
    @State() error: string;

    @Prop() stockSymbol: string;

    @Watch('stockSymbol')
    stockSymbolChanged(newValue: string, oldValue: string) {
        if (newValue !== oldValue) {
            this.stockUserInput = newValue;
            this.fetchStockPrice(newValue);
        }
    }

    onUserInput(event: Event) {
        this.stockUserInput = (event.target as HTMLInputElement).value;
        // Check wether the input is empty or not:
        if (this.stockUserInput.trim() !== '') {
            this.stockInputValid = true;
        } else {
            this.stockInputValid = false;
        }
    }

    onFetchStockPrice(event: Event) {

        event.preventDefault();

        // We use 'as HTMLInputElement' because query Selector picks up general html elements, so we tell it its an input:
        // It's only necessary to also put shadowRoot if we are using the shadow dom: (shadow: true above)
        // const stockSymbol = (this.el.shadowRoot.querySelector('#stock-symbol') as HTMLInputElement).value;

        this.stockSymbol = this.stockInput.value;
        // this.fetchStockPrice(stockSymbol);
    }

    // This method will execute right before the component is about to load
    componentWillLoad() {
        console.log('componentWillLoad');
        console.log(this.stockSymbol);
    }

    
    // componentDidLoad() {
    //     console.log('componentDidLoad');
    //     if (this.stockSymbol) {
    //         this.stockUserInput = this.stockSymbol;
    //         this.stockInputValid = true;
    //         this.fetchStockPrice(this.stockSymbol);
    //     }
    // }

    // This wil fire before its about to call rerender
    componentWillUpdate() {
        console.log('componentWillUpdate');
    }

    // This will fire when id did call render
    componentDidUpdate() {
        console.log('componentDidUpdate');
        // if (this.stockSymbol !== this.initialStockSymbol) {
        //     this.fetchStockPrice(this.stockSymbol);
        // }
    }

    // This fires when the component is removed
    disconnectedCallback() {
        console.log('componentDidUnload');
    }

    fetchStockPrice(stockSymbol: string) {
        fetch(
            `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockSymbol}&apikey=${AV_API_KEY}`
        )
            .then(res => {
                if (res.status !== 200) {
                    throw new Error('Invalid!');
                }
                // this will fire whenever we get a response, even 404 errors
                // we get the response in json format
                return res.json();
            })
            .then(parsedRes => {
                if (!parsedRes['Global Quote']['05. price']) {
                    throw new Error('Invalid symbol');
                }
                this.error = null;
                // this is the parsed response, in order to see it
                this.fetchedPrice = +parsedRes['Global Quote']['05. price'];
            })
            .catch(err => {
                // this catches any errors that may occur
                this.error = err.message;
            });
    }

    render() {
        let dataContent = <p>Please enter a symbol</p>
        if (this.error) {
            dataContent = <p>{this.error}</p>;
        }

        if (this.fetchedPrice) {
            dataContent = <p>Price: ${this.fetchedPrice}</p>;
        }

        return [
            <form onSubmit={this.onFetchStockPrice.bind(this)}>
                <input 
                    id="stock-symbol" 
                    ref={el => this.stockInput = el} 
                    value={this.stockUserInput}
                    onInput={this.onUserInput.bind(this)}
                />
                <button type="submit" disabled={!this.stockInputValid}>Fetch</button>
            </form>,
            <div>
                {dataContent}
            </div>
        ];
    }
}