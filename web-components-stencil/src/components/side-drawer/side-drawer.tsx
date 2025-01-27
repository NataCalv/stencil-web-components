import { h, Component, Prop, State, Method } from '@stencil/core';

@Component({
    tag: 'nc-side-drawer',
    styleUrl: './side-drawer.css',
    // scoped tells stencil all the styles in the styleshit should be scoped to this component only
    // shadow uses the native shadow dom
    shadow: true
})
export class SideDrawer {

    //Props are meant to be used when we want to make changes from outside the component
    // but if we know we'll only make changes from inside we have to use State:
    // Properties can have only types  assigned to them, or default values, in which case we don't put its type
    @State() showContactInfo = false;

    // Adding an attribute (it's added as a class property): (with Stencil there's no need to use 'attributeChangedCallback')
    // In order to set this from outside, a decorator must be added, which has to be imported at the top of the page:
    // Use reflect true to actually change the attribute
    // Another way to do the same the Prop does is to use slots the same way we do in vanilla JS
    @Prop({ reflect: true }) title: string;
    // Props cannot be changed from withing the component, but in order to do so we add mutable: true
    @Prop({ reflect: true, mutable: true }) opened: boolean;

    // (the 'on' of this name refers to it being an action as result of an event being triggered somewhere)
    onCloseDrawer() {
        this.opened = false;
    }

    onContentChange(content: string) {
        // A value of true or false is saved into showContactInfo:
        this.showContactInfo = content === 'contact'
    }

    // To make a method public, we have to use the Method decorator, which also needs to be imported:
    @Method()
    open() {
        this.opened = true;
    }

    render() {

        let mainContent = <slot />;

        if (this.showContactInfo) {
            mainContent = (
                <div id="contact-information">
                    <h2>Contact Information</h2>
                    <p>You can reach us via phone or email.</p>
                    <ul>
                        <li>Phone: 455765768</li>
                        <li>
                            E-mail: <a href="mailto:example@example.com"></a>
                        </li>
                    </ul>
                </div>
            );
        }

        // We put bind.(this) so that it will refer to the class and not the button:
        // We can't return two top level JS elements between (), in this case we have to return an array [] and put the top elements between commas
        return [
            <div class="backdrop" onClick={this.onCloseDrawer.bind(this)}/>,
            <aside>
                <header>
                    <h1>{this.title}</h1>
                    <button onClick={this.onCloseDrawer.bind(this)}>X</button>
                </header>
                <section id="tabs">
                    <button 
                        class={!this.showContactInfo ? 'active' : ''} 
                        onClick={this.onContentChange.bind(this, 'nav')}
                    >Navigation
                    </button>

                    <button 
                        class={this.showContactInfo ? 'active' : ''}
                        onClick={this.onContentChange.bind(this, 'contact')}
                    >Contact
                    </button>
                </section>
                <main>
                    {mainContent}
                </main>
            </aside>
        ];

        // This is commented because if we only want to change the styling there is no need to do it like this. It should be done through the css through attribute checks.
        // let content : null;
        // if (this.open) {
        //     content = (
        //         <aside>
        //             <header><h1>{this.title}</h1></header>
        //             <main>
        //                 <slot/>
        //             </main>
        //         </aside>
        //     );
        // }
    }
}