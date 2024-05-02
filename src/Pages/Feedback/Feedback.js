import React, { useEffect, useState } from 'react';
import './Feedback.css';

import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import Box from '@mui/material/Box';
import Icon from '@mui/material/Icon';

import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import { FormHelperText } from '@mui/material';

import getURL from '../../Utils/Requests.js';

export default function Feedback() {
	const [messageShowing, setMessageShowing] = useState('');
	const [successMessage, setSuccessMessage] = useState(true);
	const [submitted, setSubmitted] = useState(false);

	useEffect(() => {
		document.title = 'AtletismoPT - Feedback';
	});

	function verifyEmail(email) {
		// Check if email is valid
		const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
		if (!emailRegex.test(email)) return {
			"status": "error",
			"message": "O email introduzido não é válido."
		}
		return {
			"status": "success"
		}
	}

	function verifyTitleAndDescription(value) {
		if (value === '') return {
			"status": "error",
			"message": "Este campo não pode estar vazio"
		}
		return {
			"status": "success"
		}
	}

	function processSubmit() {
		const email = document.getElementById('feedback-Email*').value;
		const title = document.getElementById('feedback-Título*').value;
		const description = document.getElementById('feedback-Descrição*').value;

		// Check if all fields are filled
		if (email === '' || title === '' || description === '') {
			setMessageShowing('Por favor preenche todos os campos obrigatórios.');
			setSuccessMessage(false);
			return;
		}

		const emailCheck = verifyEmail(email);
		const titleCheck = verifyTitleAndDescription(title);
		const descriptionCheck = verifyTitleAndDescription(description);

		if (emailCheck.status === 'error') {
			setMessageShowing(emailCheck.message);
			setSuccessMessage(false);
			return;
		}

		if (titleCheck.status === 'error') {
			setMessageShowing(titleCheck.message);
			setSuccessMessage(false);
			return;
		}

		if (descriptionCheck.status === 'error') {
			setMessageShowing(descriptionCheck.message);
			setSuccessMessage(false);
			return;
		}


		fetch(getURL() + 'info/feedback', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				'email': email,
				'title': title,
				'feedback': description
			})
		}).then(response => {
			if (response.status === 200) {
				return response.json();
			} else {
				setMessageShowing('Ocorreu um erro ao submeter o teu feedback. Por favor tenta novamente mais tarde.');
				setSuccessMessage(false);
				return {};
			}
		}).then(data => {
			if (Object.keys(data).length !== 0) {
				setMessageShowing('O teu feedback foi submetido com sucesso!');
				setSuccessMessage(true);

				setSubmitted(true);
			}
		});
	}

	return (
		<div className='page'>
			<h1>Feedback</h1>
			<p>
				De forma a podermos melhorar o nosso website, é muito importante para nós sabermos a tua opinião!
				Se tiveres alguma sugestão, feedback ou problema com o website, por favor preenche o formulário abaixo:
			</p>

			<Box
				className='status-message'
				display={messageShowing ? 'flex' : 'none'}
				sx={{
					flexDirection: 'row',
					alignItems: 'center',

					mb: '8px',
					borderRadius: '4px',
					border: '1px solid ' + (successMessage ? '#4CAF50' : '#f44336'),
					backgroundColor: successMessage ? '#E9F7E1' : '#FFE7E7',
					color: successMessage ? '#4CAF50' : '#f44336'
				}}
			>
				<Icon
					sx={{
						p: 0,
						m: '8px 8px',
						color: successMessage ? '#4CAF50' : '#f44336',
						fontSize: '25px',
						lineHeight: 0,
					}}
				>
					{
						successMessage
							? <CheckRoundedIcon sx={{ fontSize: '25px' }} />
							: <ClearRoundedIcon sx={{ fontSize: '25px' }} />
					}
				</Icon>
				<span>{messageShowing}</span>
			</Box>

			{
				submitted
					? <p>Muito obrigado pela tua ajuda! Vamos continuar a melhorar o website e manter a base de dados o mais atualizada possível!</p>
					: <Box>
						<span className='feedback-info'>* Campo obrigatório</span>

						<FormControlComponent
							label='Email*'
							helperText='O teu email apenas vai ser utilizado caso seja necessário mais informações em caso de erro do website.'
							verifyInput={verifyEmail}
						/>

						<FormControlComponent
							label='Título*'
							helperText=''
							verifyInput={verifyTitleAndDescription}
						/>

						<FormControlComponent
							label='Descrição*'
							helperText='Em caso de erro do website, por favor refere a página e os passos que executou até encontrar o erro. Obrigado!'
							multiline={true}
							rows={6}
							verifyInput={verifyTitleAndDescription}
						/>

						<Button
							className='feedback-submit'
							variant='contained'
							onClick={() => processSubmit()}
						>
							Submeter
						</Button>
					</Box>
			}
		</div>
	);
}

function FormControlComponent(props) {
	const [error, setError] = useState(false);
	const [helperText, setHelperText] = useState(props.helperText);
	const [value, setValue] = useState('');

	return (
		<FormControl className='feedback-form' size='small'>
			<InputLabel htmlFor={`feedback-${props.label}`}>{props.label}</InputLabel>
			<OutlinedInput
				error={error}
				id={`feedback-${props.label}`}
				label={props.label}
				multiline={props.multiline || false}
				rows={props.rows || 1}
				value={value}
				onChange={(e) => setValue(e.target.value)}
				onBlur={() => {
					const res = props.verifyInput(value);
					if (res.status === "error") {
						setError(true);
						setHelperText(res.message);
					} else {
						setError(false);
						setHelperText(props.helperText);
					}
				}}
			/>
			{
				helperText !== ''
					? <FormHelperText id={`feedback-${props.label}-helper`}>{helperText}</FormHelperText>
					: null
			}
		</FormControl>
	);
}