import { ethers } from "ethers"

const Navigation = ({ account, setAccount, withdraw }) => {
    const connectHandler = async () => {
        const account = await window.ethereum.request({ method: "eth_requestAccounts" })
        // const account = ethers.utils.getAddress(accounts[0])
        window.ethereum.on("accountsChanged", () => {
            window.location.reload()
        })
        setAccount(account)
    }
    return (
        <nav>
            <div className="nav__brand">
                <h1>Metakart</h1>
            </div>
            <input type="text" className="nav__search"></input>
            {account ? (
                <button type="button" className="nav__connect">
                    {account.toString().slice(0, 6) + "..." + account.toString().slice(38, 42)}
                </button>
            ) : (
                <button type="button" className="nav__connect" onClick={connectHandler}>
                    Connect
                </button>
            )}

            <ul className="nav__links">
                <li>
                    <a href="#Clothing & Jewellery">Clothing and Jewellery</a>
                </li>
                <li>
                    <a href="#Electronics & Gadgets">Electronics & Gadgets</a>
                </li>
                <li>
                    <a href="#Toys & Gaming">Toys & Gaming</a>
                </li>
                <button type="button" className="withdraw__button" onClick={withdraw}>
                    Withdraw
                </button>
            </ul>
        </nav>
    )
}

export default Navigation
