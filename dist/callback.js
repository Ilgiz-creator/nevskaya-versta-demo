/* Demo adapter: no network request, storage or real delivery. Connect a verified backend before launch. */
document.querySelectorAll('.inquiry').forEach(root => {
  const form=root.querySelector('form');
  const result=root.querySelector('.callback-result');
  const phone=form.elements.phone;
  phone.addEventListener('input',()=>phone.setCustomValidity(''));
  form.addEventListener('submit',event=>{
    event.preventDefault();
    const digits=phone.value.replace(/\D/g,'');
    phone.setCustomValidity(digits.length>=10&&digits.length<=15?'':'Проверьте номер: укажите от 10 до 15 цифр с кодом страны.');
    if(!form.reportValidity())return;
    root.querySelector('.callback-number').textContent=phone.value.trim();
    form.hidden=true;result.hidden=false;result.focus();
  });
  root.querySelector('.callback-edit').addEventListener('click',()=>{result.hidden=true;form.hidden=false;phone.focus()});
  document.querySelectorAll('[data-occasion]').forEach(link=>link.addEventListener('click',()=>{
    result.hidden=true;form.hidden=false;
    const wishes=form.elements.wishes;if(!wishes.value)wishes.value=link.dataset.occasion;
  }));
});
const ticker=document.querySelector('.ticker');
if(ticker){const button=ticker.querySelector('.ticker-toggle');button?.addEventListener('click',()=>{
  const paused=ticker.dataset.paused!=='true';ticker.dataset.paused=String(paused);button.setAttribute('aria-pressed',String(paused));button.setAttribute('aria-label',paused?'Продолжить движение полосы':'Приостановить движение полосы');button.textContent=paused?'▶':'Ⅱ';
})}
