import React from 'react';
import { SocialIcon } from 'react-social-icons';

export default function Footer() {
	return (
		<div className='footer'>
			<div>
				<SocialIcon
					className="social-icon"
					network='instagram'
					bgColor="transparent"
					style={{
						height: 40,
						width: 40,
						margin: 0
					}}
					url="https://www.instagram.com/exy_apps/"
					target="_blank"
				/>
			</div>

			<p>AtletismoPT</p>
			<p className="footer-developer">Desenvolvido por Exy Apps</p>
		</div>
	);
}