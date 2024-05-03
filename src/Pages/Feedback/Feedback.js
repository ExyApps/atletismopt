import React from 'react';
import './Feedback.css';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';


import { StatusMessage, StatusMessageType } from '../../Components/StatusMessage/StatusMessage.js';

import getURL from '../../Utils/Requests.js';

export default class Feedback extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			submitted: false,
			sending: false
		}

		this.emailRef = React.createRef();
		this.titleRef = React.createRef();
		this.descriptionRef = React.createRef();

		this.messageRef = React.createRef();
	}

	componentDidMount() {
		document.title = 'AtletismoPT - Feedback';
	}

	verifyEmail(email) {
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

	verifyTitleAndDescription(value) {
		if (value === '') return {
			"status": "error",
			"message": "Este campo não pode estar vazio"
		}
		return {
			"status": "success"
		}
	}

	processSubmit() {
		const email = this.emailRef.current.state.value;
		const title = this.titleRef.current.state.value;
		const description = this.descriptionRef.current.state.value;

		// Check if all fields are filled
		if (email === '' || title === '' || description === '') {
			this.messageRef.current.updateMessage(
				'Por favor preenche todos os campos.',
				StatusMessageType.ERROR
			)
			return;
		}

		const emailError = this.emailRef.current.state.error;
		const titleError = this.titleRef.current.state.error;
		const descriptionError = this.descriptionRef.current.state.error;

		if (emailError || titleError || descriptionError) {
			this.messageRef.current.updateMessage(
				"Por favor verifica os campos preenchidos. Os campos com erro estão a vermelho.",
				StatusMessageType.ERROR
			)
			return;
		}

		this.setState({ sending: true });

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
				this.messageRef.current.updateMessage(
					'O teu feedback foi submetido com sucesso!',
					StatusMessageType.SUCCESS
				)
			} else {
				this.messageRef.current.updateMessage(
					'Ocorreu um erro ao submeter o teu feedback. Por favor tenta novamente.',
					StatusMessageType.ERROR
				)
			}

			this.setState({
				submitted: response.status === 200,
				sending: false
			});
		}).catch(() => {
			this.messageRef.current.updateMessage(
				'Ocorreu um erro ao submeter o teu feedback. Por favor tenta novamente.',
				StatusMessageType.ERROR
			)
			this.setState({ sending: false });
		});
	}

	render() {

		return (
			<div className='page' >
				<h1>Feedback</h1>
				<p>
					De forma a podermos melhorar o nosso website, é muito importante para nós sabermos a tua opinião!
					Se tiveres alguma sugestão, feedback ou problema com o website, por favor preenche o formulário abaixo:
				</p>

				<StatusMessage
					ref={this.messageRef}
					message=""
					type={StatusMessageType.SUCCESS}
				/>

				{
					this.state.submitted
						? <p> Muito obrigado pela tua ajuda! Vamos continuar a melhorar o website e manter a base de dados o mais atualizada possível!</p >
						: <Box>
							<span className='feedback-info'>* Campo obrigatório</span>

							<FormControlComponent
								ref={this.emailRef}
								label='Email*'
								helperText='O teu email apenas vai ser utilizado caso seja necessário mais informações em caso de erro do website.'
								verifyInput={this.verifyEmail}
							/>

							<FormControlComponent
								ref={this.titleRef}
								label='Título*'
								helperText=''
								verifyInput={this.verifyTitleAndDescription}
							/>

							<FormControlComponent
								ref={this.descriptionRef}
								label='Descrição*'
								helperText='Em caso de erro do website, por favor refere a página e os passos que executou até encontrar o erro. Obrigado!'
								multiline={true}
								rows={6}
								verifyInput={this.verifyTitleAndDescription}
							/>

							<Button
								disabled={this.state.sending}
								className='feedback-submit'
								variant='contained'
								onClick={() => this.processSubmit()}
							>
								Submeter
							</Button>
						</Box>
				}
			</div>
		);
	}

}

class FormControlComponent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			originalMessage: props.helperText,
			label: props.label,
			helperText: props.helperText,
			rows: props.rows || 1,
			multiline: props.multiline || false,
			verifyInput: props.verifyInput,

			error: false,
			value: ''
		}
	}

	render() {
		return (
			<FormControl className='feedback-form' size='small'>
				<InputLabel htmlFor={`feedback-${this.state.label}`}>{this.state.label}</InputLabel>
				<OutlinedInput
					error={this.state.error}
					id={`feedback-${this.state.label}`}
					label={this.state.label}
					multiline={this.state.multiline}
					rows={this.state.rows}
					value={this.state.value}
					onChange={(e) => this.setState({ value: e.target.value })}
					onBlur={() => {
						const res = this.state.verifyInput(this.state.value);
						if (res.status === "error") {
							this.setState({ error: true, helperText: res.message });
						} else {
							this.setState({ error: false, helperText: this.state.originalMessage });
						}
					}}
				/>
				{
					this.state.helperText !== ''
						? <FormHelperText
							id={`feedback-${this.state.label}-helper`}
							error={this.state.error}
						>
							{this.state.helperText}
						</FormHelperText>
						: null
				}
			</FormControl>
		)
	}
}