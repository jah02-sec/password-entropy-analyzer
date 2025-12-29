(function(){
  function setupPasswordToggle(inputId = 'passwordInput', buttonId = 'toggleBtn'){
    const pw = document.getElementById(inputId);
    const toggle = document.getElementById(buttonId);
    if(!pw || !toggle) return;

    toggle.setAttribute('aria-pressed', 'false');
    toggle.setAttribute('aria-label', 'Show password');
    toggle.textContent = 'Show';

    toggle.addEventListener('click', ()=>{
      const isHidden = pw.type === 'password';
      pw.type = isHidden ? 'text' : 'password';
      toggle.setAttribute('aria-pressed', String(isHidden));
      toggle.setAttribute('aria-label', isHidden ? 'Hide password' : 'Show password');
      toggle.textContent = isHidden ? 'Hide' : 'Show';
    });
  }

  window.setupPasswordToggle = setupPasswordToggle;

  function evaluateStrength(pw){
    if(!pw) return 'Weak';

    let score = 0;
    if(pw.length >= 12) score += 2;
    else if(pw.length >= 8) score += 1;

    const hasLower = /[a-z]/.test(pw);
    const hasUpper = /[A-Z]/.test(pw);
    const hasNumber = /[0-9]/.test(pw);
    const hasSpecial = /[^A-Za-z0-9]/.test(pw);
    const variety = [hasLower, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;
    if(variety >= 3) score += 2;
    else if(variety >= 2) score += 1;

    if(score >= 4) return 'Strong';
    if(score >= 2) return 'Medium';
    return 'Weak';
  }

  function computeCharsetSize(pw){
    if(!pw) return 0;
    let size = 0;
    if(/[a-z]/.test(pw)) size += 26;
    if(/[A-Z]/.test(pw)) size += 26;
    if(/[0-9]/.test(pw)) size += 10;
    if(/[^A-Za-z0-9]/.test(pw)) size += 32; 
    return size;
  }

  function computeEntropy(pw){
    if(!pw) return 0;
    const charset = computeCharsetSize(pw);
    if(charset <= 0) return 0;
    const bits = pw.length * Math.log2(charset);
    return bits;
  }

  function computeMeterPercent(pw){
    if(!pw) return 0;
    let score = 0;
    if(pw.length >= 12) score += 40;
    else if(pw.length >= 8) score += 20;
    else score += Math.min(20, pw.length * 2);

    const hasLower = /[a-z]/.test(pw);
    const hasUpper = /[A-Z]/.test(pw);
    const hasNumber = /[0-9]/.test(pw);
    const hasSpecial = /[^A-Za-z0-9]/.test(pw);
    const variety = [hasLower, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;
    score += variety * 12;

    if(/(.)\1{2,}/.test(pw)) score -= 15;
    if(/(0123|1234|2345|abcd|qwerty)/i.test(pw)) score -= 10;
    const common = ['password','pass','123456','qwerty','letmein','admin'];
    if(common.some(c => pw.toLowerCase().includes(c))) score -= 20;

    score = Math.round(Math.max(0, Math.min(100, score)));
    return score;
  }

  function entropyToLabel(bits){
    if(bits < 30) return 'Very weak';
    if(bits <= 49) return 'Weak';
    if(bits <= 69) return 'Medium';
    if(bits <= 89) return 'Strong';
    return 'Very strong';
  }

  function updateStrengthUI(pw){
    const bits = computeEntropy(pw);
    const level = entropyToLabel(bits);

    const txt = document.getElementById('strengthText');
    const box = document.getElementById('strengthFeedback');
    if(!txt || !box) return;

    txt.textContent = level;

    const classNames = ['very-weak','weak','medium','strong','very-strong'];
    box.classList.remove(...classNames);
    box.classList.add(level.toLowerCase().replace(/ /g, '-'));

    const entropyEl = document.getElementById('entropy');
    const entropyVal = document.getElementById('entropyValue');
    if(entropyEl && entropyVal){
      const charset = computeCharsetSize(pw);
      entropyVal.textContent = `${bits.toFixed(1)} bits`;
      const charsetEl = document.getElementById('charsetSize');
      if(charsetEl) charsetEl.textContent = String(charset);

      entropyEl.classList.remove(...classNames);
      entropyEl.classList.add(level.toLowerCase().replace(/ /g, '-'));
    }

    const percent = computeMeterPercent(pw);
    const meter = document.getElementById('meterFill');
    const meterWrap = document.querySelector('.meter');
    if(meter){
      meter.style.width = percent + '%';
      meter.classList.remove(...classNames);
      meter.classList.add(level.toLowerCase().replace(/ /g, '-'));
    }
    if(meterWrap) meterWrap.setAttribute('aria-valuenow', percent);
  }

  function initStrengthListener(){
    const input = document.getElementById('passwordInput');
    if(!input) return;
    updateStrengthUI(input.value);
    input.addEventListener('input', (e)=> updateStrengthUI(e.target.value));
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', ()=>{ setupPasswordToggle(); initStrengthListener(); });
  } else {
    setupPasswordToggle();
    initStrengthListener();
  }
})();