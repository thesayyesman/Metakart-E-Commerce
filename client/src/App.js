import { useEffect, useState } from "react"
import { ethers } from "ethers"

// Components
import Navigation from "./components/Navigation"
import Section from "./components/Section"
import Product from "./components/Product"

// ABIs
import Dappazon from "./abi/Dappazon.json"

// Config
import config from "./config.json"

function App() {
    const [account, setAccount] = useState(null)
    const [provider, setProvider] = useState(null)
    const [contract, setContract] = useState(null)

    const [electronics, setElectronics] = useState([])
    const [clothing, setClothing] = useState([])
    const [toys, setToys] = useState([])

    const [item, setItem] = useState({})
    const [toggle, setToggle] = useState(false)

    const togglePop = (item) => {
        setItem(item)
        toggle ? setToggle(false) : setToggle(true)
    }

    const loadBlockchainData = async () => {
        const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

        //Connect to Blockchain
        const provider = new ethers.BrowserProvider(window.ethereum)
        setProvider(provider)
        const network = await provider.getNetwork()
        console.log(network)

        //Connect to Smart Contract
        const contract = new ethers.Contract(contractAddress, Dappazon, provider)
        setContract(contract)

        //Load Products
        const items = []
        for (var i = 0; i < 9; i++) {
            const item = await contract.items(i + 1)
            items.push(item)
        }
        // console.log(items)

        const electronics = items.filter((item) => item.category === "electronics")
        const clothing = items.filter((item) => item.category === "clothing")
        const toys = items.filter((item) => item.category === "toys")
        setElectronics(electronics)
        setClothing(clothing)
        setToys(toys)

        // console.log(clothing)
    }

    useEffect(() => {
        loadBlockchainData()
    }, [])

    const withdraw = async () => {
        const signer = await provider.getSigner()

        {
            signer.address === (await contract.owner())
                ? await contract.connect(signer).withdraw()
                : alert("You don't have Permissions.")
        }
    }

    return (
        <div>
            <Navigation account={account} setAccount={setAccount} withdraw={withdraw} />
            <img
                className="title_image"
                src="https://images-static.nykaa.com/uploads/f26db3a2-f7f9-4e69-b573-52caf5990030.gif?tr=w-2400,cm-pad_resize"
                alt="jknfjkvnj"
            />
            <marquee>
                <strong>Today's Price: 1ETH = 2,248.48 USD</strong>
            </marquee>
            <p className="shop_category">SHOP BY CATEGORY</p>
            <h2>Featured products</h2>
            {electronics && clothing && toys && (
                <>
                    <Section
                        title={"Clothing & Jewellery"}
                        items={clothing}
                        togglePop={togglePop}
                    />
                    <Section
                        title={"Electronics & Gadgets"}
                        items={electronics}
                        togglePop={togglePop}
                    />
                    <Section title={"Toys & Gaming"} items={toys} togglePop={togglePop} />
                </>
            )}

            <img
                className="title_image"
                src="https://images-static.nykaa.com/uploads/f0ef4826-d502-4ac7-83d9-4cbab7a70c5a.jpg?tr=w-2400,cm-pad_resize"
                alt="jknfjkvnj"
            />

            {toggle && (
                <Product
                    item={item}
                    provider={provider}
                    account={account}
                    contract={contract}
                    togglePop={togglePop}
                />
            )}

            <footer className="footer">Copyright &copy; Metakart.com</footer>
        </div>
    )
}

export default App
