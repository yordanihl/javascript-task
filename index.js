(() => {
	const backend = (() => {
		const registeredUsers = [
			{ name: 'admin', pass: '123' },
			{ name: 'server', pass: 'abc' },
			{ name: 'istrator', pass: 'abv' },
		];

		const loginSubmit = (name, pass) => {
			for (let user of registeredUsers) {
				if (user.name == name && user.pass == pass) return true;
			}
			return false;
		};

		return {
			loginSubmit,
		};
	})();

	const loginForm = document.getElementById('login-form');

	loginForm.addEventListener('submit', (e) => {
		e.preventDefault();

		const formData = new FormData(loginForm);
		const formName = formData.get('name');
		const formPass = formData.get('pass');
		const loginSuccess = backend.loginSubmit(formName, formPass);

		setTimeout(() => {
			if (loginSuccess) {
				sessionStorage.setItem('userName', formName);
				location.replace('/main-check.html');
			} else {
				document.getElementById('login-message').innerText =
					'Incorrect Username or Password.';
			}
		}, 1000);
	});
})();
