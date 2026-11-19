// 1. Khởi tạo hiệu ứng cuộn
AOS.init({ once: true, offset: 100 });

// 2. Hiệu ứng chữ đánh máy
var typed = new Typed('#typed-text', {
    strings: ["Gửi những người lái đò thầm lặng...", "Tri ân những người gieo mầm tri thức...", "Cảm ơn Thầy Cô vì tất cả!"],
    typeSpeed: 50, backSpeed: 30, loop: true
});

// 3. Nền hạt bay
particlesJS("particles-js", {
    "particles": {
        "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
        "color": { "value": "#d4af37" }, "shape": { "type": "circle" },
        "opacity": { "value": 0.5, "random": true }, "size": { "value": 3, "random": true },
        "line_linked": { "enable": false }, "move": { "enable": true, "speed": 1, "out_mode": "out" }
    }
});

// 4. Hiệu ứng cánh hoa rơi
const petalsContainer = document.getElementById('petals-container');
const petalEmojis = ['🌸', '🌺', '🌼', '🍁']; // Các loại hoa

function createPetal() {
    const petal = document.createElement('div');
    petal.classList.add('petal');
    petal.innerText = petalEmojis[Math.floor(Math.random() * petalEmojis.length)];
    
    // Kích thước và vị trí ngẫu nhiên
    petal.style.left = Math.random() * 100 + 'vw';
    petal.style.fontSize = Math.random() * 15 + 15 + 'px';
    petal.style.animationDuration = Math.random() * 5 + 5 + 's'; // Rơi từ 5-10s
    petal.style.opacity = Math.random() * 0.5 + 0.5;

    petalsContainer.appendChild(petal);

    // Xóa hoa sau khi rơi xong
    setTimeout(() => petal.remove(), 10000);
}
setInterval(createPetal, 500); // Cứ 0.5s tạo 1 cánh hoa

// 5. Xử lý đóng/mở Modal chung
function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// --- CHỨC NĂNG LIGHTBOX (PHÓNG TO ẢNH) ---
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeLightbox = document.querySelector('.close-lightbox');

function setupLightbox(imgElement) {
    imgElement.addEventListener('click', function() {
        lightbox.style.display = "block";
        lightboxImg.src = this.src;
    });
}
// Gắn sự kiện cho ảnh có sẵn
document.querySelectorAll('.zoomable').forEach(setupLightbox);
// Đóng lightbox
closeLightbox.onclick = () => lightbox.style.display = "none";
lightbox.onclick = (e) => { if(e.target !== lightboxImg) lightbox.style.display = "none"; };

// --- CHỨC NĂNG THÊM KỶ NIỆM ---
const memoryModal = document.getElementById('memory-modal');
const openMemoryBtn = document.getElementById('open-memory-btn');
const saveMemoryBtn = document.getElementById('save-memory-btn');
const timelineContainer = document.getElementById('timeline-container');
let memoryCount = 3;

openMemoryBtn.addEventListener('click', () => memoryModal.classList.add('active'));

function addMemoryToDOM(title, text, imgSrc, side) {
    const newMemory = document.createElement('div');
    newMemory.className = `container-timeline ${side}`;
    newMemory.setAttribute('data-aos', side === 'left' ? 'fade-right' : 'fade-left');
    const imgHTML = imgSrc ? `<img src="${imgSrc}" class="zoomable" alt="Kỷ niệm">` : '';

    newMemory.innerHTML = `<div class="content-timeline"><h3>${title}</h3><p>${text}</p>${imgHTML}</div>`;
    timelineContainer.appendChild(newMemory);
    
    // Nếu có ảnh mới, kích hoạt Lightbox cho ảnh đó
    if(imgSrc) {
        setupLightbox(newMemory.querySelector('.zoomable'));
    }
    AOS.refresh();
}

saveMemoryBtn.addEventListener('click', () => {
    const title = document.getElementById('memory-title').value.trim();
    const text = document.getElementById('memory-text').value.trim();
    const imageFile = document.getElementById('memory-image').files[0];

    if (!title || !text) return alert('Vui lòng nhập tiêu đề và nội dung!');
    
    const side = (memoryCount % 2 === 0) ? 'left' : 'right';

    const processSave = (base64Img) => {
        addMemoryToDOM(title, text, base64Img, side);
        const memories = JSON.parse(localStorage.getItem('timelineMemories')) || [];
        memories.push({ title, text, img: base64Img, side });
        localStorage.setItem('timelineMemories', JSON.stringify(memories));

        document.getElementById('memory-title').value = '';
        document.getElementById('memory-text').value = '';
        document.getElementById('memory-image').value = '';
        closeModal('memory-modal');
        memoryCount++;
    };

    if (imageFile) {
        if (imageFile.size > 1024 * 1024) return alert('Ảnh quá lớn! Vui lòng chọn ảnh dưới 1MB.');
        const reader = new FileReader();
        reader.onload = (e) => processSave(e.target.result);
        reader.readAsDataURL(imageFile);
    } else processSave(null);
});

function loadMemories() {
    const memories = JSON.parse(localStorage.getItem('timelineMemories')) || [];
    memories.forEach(mem => { addMemoryToDOM(mem.title, mem.text, mem.img, mem.side); memoryCount++; });
}
loadMemories();

// --- CHỨC NĂNG BẢNG ĐEN ---
const canvas = document.getElementById('chalkboard');
const ctx = canvas.getContext('2d');
let isDrawing = false;

// Thiết lập nét vẽ (màu phấn trắng)
ctx.strokeStyle = '#ffffff';
ctx.lineWidth = 3;
ctx.lineCap = 'round';

function getMousePos(evt) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    // Hỗ trợ cả cảm ứng (touch) và chuột (mouse)
    let clientX = evt.clientX || (evt.touches && evt.touches[0].clientX);
    let clientY = evt.clientY || (evt.touches && evt.touches[0].clientY);

    return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY
    };
}

function startDrawing(e) {
    isDrawing = true;
    const pos = getMousePos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
}
function draw(e) {
    if (!isDrawing) return;
    e.preventDefault(); // Ngăn cuộn trang khi vẽ trên mobile
    const pos = getMousePos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
}
function stopDrawing() {
    isDrawing = false;
    ctx.closePath();
}
function clearBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Gắn sự kiện chuột
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);
// Gắn sự kiện cảm ứng (điện thoại)
canvas.addEventListener('touchstart', startDrawing, {passive: false});
canvas.addEventListener('touchmove', draw, {passive: false});
canvas.addEventListener('touchend', stopDrawing);

// --- CHỨC NĂNG VƯỜN HOA TRI ÂN ---
// --- CHỨC NĂNG VƯỜN HOA TRI ÂN ---
const wishModal = document.getElementById('wish-modal');
const openWishBtn = document.getElementById('open-wish-btn');
const sendWishBtn = document.getElementById('send-wish-btn');
const gardenContainer = document.getElementById('garden-container');
const viewWishModal = document.getElementById('view-wish-modal');
const viewWishTitle = document.getElementById('view-wish-title');
const viewWishText = document.getElementById('view-wish-text');

openWishBtn.addEventListener('click', () => {
    wishModal.classList.add('active');
});

function plantFlower(name, text) {
    const flower = document.createElement('div');
    flower.className = 'flower';

    const flowers = ['🌻', '🌹', '🌷', '🌺', '🌸'];
    flower.innerText = flowers[Math.floor(Math.random() * flowers.length)];
    flower.style.animationDuration = (Math.random() * 2 + 2) + 's';

    flower.addEventListener('click', () => {
        viewWishTitle.innerText = "- " + name + " -";
        viewWishText.innerText = text;
        viewWishModal.classList.add('active');
    });

    gardenContainer.appendChild(flower);
}

sendWishBtn.addEventListener('click', async () => {
    const name = document.getElementById('wish-name').value.trim();
    const text = document.getElementById('wish-text').value.trim();

    if (!name || !text) {
        return alert('Vui lòng nhập đầy đủ tên và lời chúc nhé!');
    }

    if (!window.gardenDB) {
        return alert('Firebase chưa kết nối. Vui lòng tải lại trang!');
    }

    sendWishBtn.disabled = true;

    try {
        await window.gardenDB.addWish(name, text);

        document.getElementById('wish-name').value = '';
        document.getElementById('wish-text').value = '';

        closeModal('wish-modal');
    } catch (error) {
        console.error('Lỗi gửi lời chúc:', error);
        alert('Không thể gửi lời chúc. Hãy kiểm tra kết nối Firebase!');
    } finally {
        sendWishBtn.disabled = false;
    }
});

function startGardenListener() {
    if (!window.gardenDB || startGardenListener.started) return;
    startGardenListener.started = true;

    window.gardenDB.listen(wishes => {
        gardenContainer.innerHTML = '';

        wishes.forEach(wish => {
            plantFlower(wish.name, wish.text);
        });
    }, error => {
        console.error('Lỗi tải lời chúc:', error);
        alert('Không thể tải khu vườn lời chúc!');
    });
}

window.addEventListener('gardenDBReady', startGardenListener);
startGardenListener();

// --- NHẠC VÀ ĐÈN LỒNG ---
let isPlaying = false;
function toggleMusic() {
    const music = document.getElementById('bg-music');
    const btn = document.getElementById('music-btn');
    if (isPlaying) { music.pause(); btn.innerHTML = '<i class="fas fa-music"></i>'; }
    else { music.play(); btn.innerHTML = '<i class="fas fa-pause"></i>'; }
    isPlaying = !isPlaying;
}

function releaseLanterns() {
    const numLanterns = 40;
    for (let i = 0; i < numLanterns; i++) {
        setTimeout(() => {
            const lantern = document.createElement('div');
            lantern.classList.add('lantern');
            lantern.style.left = Math.random() * 100 + 'vw';
            const size = Math.random() * 20 + 30;
            lantern.style.width = size + 'px';
            lantern.style.height = (size * 1.5) + 'px';
            const duration = Math.random() * 5 + 5;
            lantern.style.animationDuration = duration + 's';
            lantern.style.transform = `rotate(${Math.random() * 20 - 10}deg)`;
            document.body.appendChild(lantern);
            setTimeout(() => lantern.remove(), duration * 1000);
        }, i * 150);
    }
}