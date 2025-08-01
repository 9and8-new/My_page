const countryCodes = [
    { name: "대한민국", code: "+82" },
    { name: "일본", code: "+81" },
    { name: "중국", code: "+86" },
    { name: "미국", code: "+1" },
    { name: "캐나다", code: "+1" },
    { name: "영국", code: "+44" },
    { name: "프랑스", code: "+33" },
    // ... 전체 국가코드 데이터!
];
const $nation = document.getElementById('buyer-nation');
countryCodes.forEach(item => {
    const opt = document.createElement('option');
    opt.value = item.code;
    opt.textContent = `${item.name} (${item.code})`;
    $nation.appendChild(opt);
});
$nation.value = "+82"; // 기본값 대한민국


// 공용 함수, 변수
const defaultInfo = {
    email: "goodjob@see.you", last: "홍", first: "길동", nation: "+82", phone: "01012341234", zip: "41943",
    address: "대구광역시 중구 중앙대로 366", detail: "반월당 센트럴 타워 9층, 10층"
};
defaultInfo.username = defaultInfo.last + defaultInfo.first;
const $ = id => document.getElementById(id);
let couponVisible = false;
let currentCoupon = 0;
document.getElementById('login-email').innerText = defaultInfo.email;
document.getElementById('login-username').innerText = defaultInfo.username + "님";


// 장바구니 샘플 데이터
let cartItems = [
    { id: 1, name: "Adidas Waffle Shirt", options: ["FREE", "XL", "L"], option: "FREE", qty: 1, price: 62100 },
    { id: 2, name: "OFOGS Original Ballcap", options: ["FREE", "네이비", "블랙"], option: "FREE", qty: 1, price: 53100 },
    { id: 3, name: "Nike Air Max", options: ["260", "270", "280"], option: "270", qty: 1, price: 129000 },
    { id: 4, name: "UNIQLO U Crew Neck", options: ["L", "XL", "XXL"], option: "L", qty: 3, price: 29900 },
    { id: 5, name: "New Balance 993", options: ["260", "265", "270"], option: "265", qty: 1, price: 219000 },
    { id: 6, name: "Birkenstock Boston", options: ["42", "43", "44"], option: "42", qty: 1, price: 115000 },
    { id: 7, name: "Carhartt Cap", options: ["FREE", "네이비", "블랙"], option: "네이비", qty: 1, price: 35000 },
    { id: 8, name: "ADER Error Bag", options: ["One Size", "Mini", "Big"], option: "One Size", qty: 1, price: 87000 },
    { id: 9, name: "Supreme Tee", options: ["XL", "L", "M"], option: "XL", qty: 1, price: 95000 },
    { id: 10, name: "Mmlg 1987 Hoodie", options: ["M", "L", "XL"], option: "M", qty: 2, price: 89000 }
];

// 구매자 정보 세팅
function setBuyerInfo(useMember) {
    if (useMember) {
        $("buyer-last").value = defaultInfo.last;
        $("buyer-first").value = defaultInfo.first;
        $("buyer-nation").value = defaultInfo.nation;
        $("buyer-phone").value = defaultInfo.phone;
        $("buyer-zip").value = defaultInfo.zip;
        $("buyer-address").value = defaultInfo.address;
        $("buyer-detail").value = defaultInfo.detail;
        ["buyer-last", "buyer-first", "buyer-nation", "buyer-phone", "buyer-zip", "buyer-address", "buyer-detail"]
            .forEach(id => { $(id).readOnly = true; });
    } else {
        ["buyer-last", "buyer-first", "buyer-nation", "buyer-phone", "buyer-zip", "buyer-address", "buyer-detail"]
            .forEach(id => {
                $(id).value = '';
                $(id).readOnly = false;
            });
    }
}

// 수령자 정보 토글
function handleRecipientCheck() {
    const recipientCheck = $("recipient-info-check");
    const recipientInput = $("recipient-input-wrap");
    recipientCheck.addEventListener('change', function () {
        if (this.checked) {
            recipientInput.style.display = 'none';
            // 입력칸 값 모두 비움
            ['recipient-last', 'recipient-first', 'recipient-nation', 'recipient-phone', 'recipient-zip', 'recipient-address', 'recipient-detail']
                .forEach(id => $(id).value = '');
        } else {
            recipientInput.style.display = 'block';
        }
    });
}

// 장바구니 렌더
function renderCart() {
    const cartList = $("cart-list");
    cartList.innerHTML = cartItems.map((item, i) => `
        <div class="summary-item" data-id="${item.id}">
          <div class="summary-thumb">이미지</div>
          <div class="summary-info">
            <div class="cart-name">${item.name}</div>
            <div class="cart-opt">
              옵션<span class="dot">·</span>
              <select class="cart-opt-select" data-idx="${i}">
                ${item.options.map(opt => `<option value="${opt}"${item.option === opt ? ' selected' : ''}>${opt}</option>`).join('')}
              </select>
            </div>
            <div class="cart-qty">
              수량<span class="dot">·</span>
              <select class="cart-qty-select" data-idx="${i}">
                ${[...Array(10).keys()].map(n => `<option value="${n + 1}"${item.qty == n + 1 ? ' selected' : ''}>${n + 1}</option>`).join('')}
              </select>
            </div>
            <div class="cart-price">가격<span class="dot">·</span><b>${(item.price * item.qty).toLocaleString()}원</b></div>
          </div>
          <button class="remove-btn" title="삭제" data-idx="${i}">✕</button>
        </div>
      `).join('');
    $("cart-count").innerText = cartItems.length;
    updatePrice();
}

// 가격 합계/할인
function updatePrice() {
    let subtotal = cartItems.reduce((a, b) => a + b.price * b.qty, 0);
    let discount = Math.floor(subtotal * (currentCoupon / 100));
    let total = subtotal - discount;
    $("subtotal").innerText = subtotal.toLocaleString() + "원";
    $("discount").innerText = discount.toLocaleString() + "원";
    $("total").innerText = total.toLocaleString() + "원";
}

// 쿠폰 토글
function toggleCoupon() {
    couponVisible = !couponVisible;
    $("coupon-list").style.display = couponVisible ? 'block' : 'none';
}
// 쿠폰 적용
function applyCoupon(percent) {
    currentCoupon = percent;
    renderCart();
    toggleCoupon();
}

// 한 번만 등록하는 이벤트 리스너
document.addEventListener('change', function (e) {
    if (e.target.classList.contains('cart-qty-select')) {
        let idx = e.target.dataset.idx;
        cartItems[idx].qty = parseInt(e.target.value, 10);
        renderCart();
    }
    if (e.target.classList.contains('cart-opt-select')) {
        let idx = e.target.dataset.idx;
        cartItems[idx].option = e.target.value;
        renderCart();
    }
    if (e.target.id === "buyer-info-check") {
        setBuyerInfo(e.target.checked);
    }
});
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('remove-btn')) {
        let idx = e.target.dataset.idx;
        cartItems.splice(idx, 1);
        renderCart();
    }
    // 쿠폰 영역 아닌 곳 클릭시 닫기
    const coupon = document.querySelector('.coupon-section');
    if (coupon && !coupon.contains(e.target)) {
        $("coupon-list").style.display = 'none';
        couponVisible = false;
    }
});

// **초기 실행**
setBuyerInfo(true);
handleRecipientCheck();
renderCart();


const $recipientNation = document.getElementById('recipient-nation');
countryCodes.forEach(item => {
    const opt = document.createElement('option');
    opt.value = item.code;
    opt.textContent = `${item.name} (${item.code})`;
    $recipientNation.appendChild(opt);
});
$recipientNation.value = "+82";
$nation.value = "+82"; // 기본값 대한민국