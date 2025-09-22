import React from "react";

import "./index.css";

import Header from "../../components/header";
import WalletSection from "../../components/wallet";
import Footer from "../../components/footer";

function Wallet() {
	return (
		<div>
			<div className="header_section">
				<Header />
			</div>
			<WalletSection />
			<Footer />
		</div>
	);
}


export default Wallet;