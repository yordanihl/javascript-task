(() => {
	const userName = sessionStorage.getItem('userName');
	const userList = newUserList();
	const uiTable = newUiTable();
	const uiDetails = newUiDetails();
	const uiPages = newUiPages();
	const actions = newActions();

	document.getElementById('heading-username').innerText = userName;

	uiPages.render(5);
	actions.showPage(1);

	function newUserList() {
		const userArray = [];
		const pageLength = 10;

		return {
			addPage,
			getPage,
			getUser,
			getPageLength,
		};

		function getPageLength() {
			return pageLength;
		}

		function convertDate(string) {
			const objDate = new Date(string);
			const months = [
				'January',
				'February',
				'March',
				'April',
				'May',
				'June',
				'July',
				'August',
				'September',
				'October',
				'November',
				'December',
			];
			return `${
				months[objDate.getMonth()]
			} ${objDate.getDate()}, ${objDate.getFullYear()}`;
		}

		function addPage(users, pageNum) {
			userArray[pageNum] = users.map((user) => ({
				id: Math.floor(100000000 + Math.random() * 900000000),
				name: user.name.first + ' ' + user.name.last,
				age: user.dob.age,
				address:
					user.location.street.number +
					' ' +
					user.location.street.name +
					', ' +
					user.location.city +
					', ' +
					user.location.state,
				gender: user.gender,
				country: user.location.country,
				timezone: user.location.timezone.offset,
				email: user.email,
				phone: user.cell,
				dob: convertDate(user.dob.date),
				dor: convertDate(user.registered.date),
				accAge: user.registered.age,
				picture: user.picture.large,
			}));
		}

		function getPage(pageNum) {
			return userArray[pageNum];
		}

		function getUser(id, pageNum) {
			return userArray[pageNum].find((user) => user.id == id);
		}
	}

	function newUiTable() {
		const elemTableHead = document.getElementById('main-table-head');
		const elemTableBody = document.getElementById('main-table-body');
		const elemLoading = document.getElementById('main-table-popup-loading');
		const elemError = document.getElementById('main-table-popup-error');
		const tableFields = [
			{ name: 'name', value: 'Name' },
			{ name: 'age', value: 'Age' },
			{ name: 'address', value: 'Address' },
			{ name: 'gender', value: 'Gender' },
		];

		renderHead();

		return {
			render,
			toggleLoading,
			toggleError,
		};

		function renderHead() {
			const fields = tableFields.reduce(
				(html, item) => `${html}<th>${item.value}</th>`,
				''
			);
			elemTableHead.innerHTML = `<tr>${fields}</tr>`;
		}

		function eventSelectUser() {
			uiDetails.show(this);
		}

		function render(shownUsers) {
			elemTableBody.innerHTML = '';
			for (const user of shownUsers) {
				const thisTr = document.createElement('tr');
				thisTr.setAttribute('class', 'main-table__user');
				thisTr.addEventListener('click', eventSelectUser.bind(user.id));
				thisTr.innerHTML = tableFields.reduce((html, item) => {
					return `${html}<td>
						<div class="main-table__user__mobile-label">${item.value}</div>
						<div class="main-table__user__cell">${user[item.name]}</div>
					</td>`;
				}, '');
				elemTableBody.appendChild(thisTr);
			}
		}

		function toggleLoading(show) {
			toggleError(false);
			if (show) elemLoading.classList.remove('hidden');
			else elemLoading.classList.add('hidden');
		}

		function toggleError(show, message) {
			elemError.firstElementChild.innerText = message;
			if (show) elemError.classList.remove('hidden');
			else elemError.classList.add('hidden');
		}
	}

	function newUiDetails() {
		const elemTableDetails = document.getElementById('main-table-details');
		const elemDetailsBtnClose = document.getElementById('details-btn-close');
		const elemDetailsName = document.getElementById('details-name');
		const elemDetailsDob = document.getElementById('details-dob');
		const elemDetailsAge = document.getElementById('details-age');
		const elemDetailsAddress = document.getElementById('details-address');
		const elemDetailsCountry = document.getElementById('details-country');
		const elemDetailsTimezone = document.getElementById('details-timezone');
		const elemDetailsGender = document.getElementById('details-gender');
		const elemDetailsDor = document.getElementById('details-dor');
		const elemDetailsAccAge = document.getElementById('details-acc-age');
		const elemDetailsEmail = document.getElementById('details-email');
		const elemDetailsPhone = document.getElementById('details-phone');
		const elemDetailsPicture = document.getElementById('details-picture');

		elemDetailsBtnClose.addEventListener('click', hide);

		return {
			show,
		};

		function render(thisUser) {
			elemDetailsName.innerText = thisUser.name;
			elemDetailsDob.innerText = thisUser.dob;
			elemDetailsAge.innerText = thisUser.age;
			elemDetailsAddress.innerText = thisUser.address;
			elemDetailsCountry.innerText = thisUser.country;
			elemDetailsTimezone.innerText = thisUser.timezone;
			elemDetailsGender.innerText = thisUser.gender;
			elemDetailsDor.innerText = thisUser.dor;
			elemDetailsAccAge.innerText = thisUser.accAge;
			elemDetailsEmail.innerText = thisUser.email;
			elemDetailsPhone.innerText = thisUser.phone;
			elemDetailsPicture.setAttribute('src', thisUser.picture);
		}

		function show(userId) {
			render(userList.getUser(userId, uiPages.getCurrentPage()));
			elemTableDetails.classList.remove('hidden');
		}

		function hide() {
			elemTableDetails.classList.add('hidden');
		}
	}

	function newUiPages() {
		const elemTablePages = document.getElementById('main-table-pages');
		const elemPages = [];
		let currentPage = 1;

		return {
			render,
			selectPage,
			getCurrentPage,
		};

		function getCurrentPage() {
			return currentPage;
		}

		/**
		 * @param {number} lastPage how many pages to render
		 */
		function render(lastPage) {
			for (let i = 0; i < lastPage; i++) {
				elemPages[i] = document.createElement('span');
				elemPages[i].setAttribute('class', 'main-table-pages__single');
				elemPages[i].innerText = i + 1;
				elemPages[i].addEventListener('click', eventSelectPage.bind(i));
				elemTablePages.appendChild(elemPages[i]);
			}
			selectPage(1);
		}

		function eventSelectPage() {
			actions.showPage(this + 1);
		}

		function selectPage(index) {
			for (const elemPage of elemPages) {
				elemPage.classList.remove('selected');
			}
			elemPages[index - 1].classList.add('selected');
			currentPage = index;
		}
	}

	function newActions() {
		return {
			showPage,
		};

		async function showPage(page) {
			const thisPage = userList.getPage(page);
			uiPages.selectPage(page);
			if (thisPage !== undefined) return uiTable.render(thisPage);

			uiTable.toggleLoading(true);
			const usersResponse = await fetchPageData(page);
			uiTable.toggleLoading(false);
			if (usersResponse instanceof Error)
				return uiTable.toggleError(true, usersResponse.message);
			userList.addPage(usersResponse, page);
			uiTable.render(userList.getPage(page));
		}

		async function fetchPageData(page) {
			let status;
			await axios
				.get(
					`https://randomuser.me/api/?seed=${userName}&results=${userList.getPageLength()}&page=${page}`
				)
				.then((res) => (status = res.data.results))
				.catch((res) => (status = res));
			return status;
		}
	}
})();
