const refs = {
  openModalBtn: document.querySelector('[data-action="open-modal"]'),
  closeModalBtn: document.querySelector('[data-action="close-modal"]'),
  backdrop: document.querySelector('.js-backdrop'),
  videoFrameWrapper: document.querySelector('.video-frame-wrapper'),
  videoFrame: document.querySelector('.video-frame'),
  visitButton: document.querySelector('.visit-button'),
  modalVideoTitle: document.querySelector('.modal-video-title'),
  // modalVideoInteractioncount: document.querySelector(
  //   '.modal-video-interactioncount'
  // ),
  modalMediaData: document.querySelector('.modal-media-data'),
};

refs.openModalBtn.addEventListener('click', onOpenModal);
refs.closeModalBtn.addEventListener('click', onCloseModal);
refs.backdrop.addEventListener('click', onBackdropClick);

function onOpenModal(event) {
  refs.videoFrame.setAttribute('src', null);
  if (!event.target.closest('.card')) {
    return;
  }

  const videoData = event.target.closest('.card');
  const videoLink = videoData.dataset.video;

  const titleData = videoData.getElementsByClassName('card_title');

  const title = titleData[0].innerText;
  refs.modalVideoTitle.innerText = title;

  ////////////////////////////////////////////////////////////

  const homePageData = videoData.getElementsByClassName('homePage');
  const homePage = homePageData[0].innerText;

  const interactioncountData =
    videoData.getElementsByClassName('interactioncount');

  const interactioncount = interactioncountData[0].innerText;

  // const ttt =
  //   '<b class="grayRound"><svg width="4" height="4" viewBox="0 0 4 4" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="2" cy="2" r="2" fill="#5D6067"/></svg></b>';

//  const ttt =
//    homePage && interactioncount
//      ? '<b class="grayRound"><svg width="4" height="4" viewBox="0 0 4 4" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="2" cy="2" r="2" fill="#5D6067"/></svg></b>'
//      : '';
  
   const ttt = homePage && interactioncount ? '<b class="grayRound">|</b>' : '';

  refs.modalMediaData.innerHTML = homePage + ttt + interactioncount;

  // refs.modalVideoInteractioncount.innerText = interactioncount;

  /////////////////////////////////////////////////////////////////

  refs.videoFrame.setAttribute('src', videoLink);
  refs.visitButton.setAttribute('href', videoLink);

  window.addEventListener('keydown', onEscPress);
  document.body.classList.add('show-modal');
}

function onCloseModal() {
  window.removeEventListener('keydown', onEscPress);
  document.body.classList.remove('show-modal');
}

function onBackdropClick(event) {
  if (event.target === event.currentTarget) {
    onCloseModal();
  }
}

function onEscPress(event) {
  const ESC_KEY_CODE = `Escape`;
  if (event.code === ESC_KEY_CODE) {
    onCloseModal();
  }
}
