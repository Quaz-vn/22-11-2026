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
        "color": { "value": "#d4af37" },
        "shape": { "type": "circle" },
        "opacity": { "value": 0.5, "random": true },
        "size": { "value": 3, "random": true },
        "line_linked": { "enable": false },
        "move": { "enable": true, "speed": 1, "direction": "none", "random": true, "out_mode": "out" }
    },
    "interactivity": {
        "events": { "onhover": { "enable": true, "mode": "bubble" } },
        "modes": { "bubble": { "distance": 200, "size": 5, "duration": 2 } }
    },
    "retina_detect": true
});

// 4. Đóng/Mở Modal chung
function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// --- CHỨC NĂNG: THÊM KỶ NIỆM ---
const memoryModal = document.getElementById('memory-modal');
const openMemoryBtn = document.getElementById('open-memory-btn');
const saveMemoryBtn = document.getElementById('save-memory-btn');
const timelineContainer = document.getElementById('timeline-container');
let memoryCount = 3; // Đã có sẵn 3 kỷ niệm mặc định trong HTML

openMemoryBtn.addEventListener('click', () => memoryModal.classList.add('active'));

// Hàm thêm thẻ kỷ niệm vào Timeline
function addMemoryToDOM(title, text, imgSrc, side) {
    const newMemory = document.createElement('div');
    newMemory.className = `container-timeline ${side}`;
    newMemory.setAttribute('data-aos', side === 'left' ? 'fade-right' : 'fade-left');
    
    // Nếu không có ảnh, ẩn thẻ img đi
    const imgHTML = imgSrc ? `<img src="${imgSrc}" alt="Kỷ niệm">` : '';

    newMemory.innerHTML = `
        <div class="content-timeline">
            <h3>${title}</h3>
            <p>${text}</p>
            ${imgHTML}
        </div>
    `;
    timelineContainer.appendChild(newMemory);
    AOS.refresh(); // Làm mới AOS để hiệu ứng hoạt động với thẻ mới
}

saveMemoryBtn.addEventListener('click', () => {
    const title = document.getElementById('memory-title').value.trim();
    const text = document.getElementById('memory-text').value.trim();
    const imageFile = document.getElementById('memory-image').files[0];

    if (!title || !text) {
        alert('Vui lòng nhập tiêu đề và nội dung kỷ niệm!');
        return;
    }

    // Xác định bên trái/phải dựa vào số lượng hiện tại
    const side = (memoryCount % 2 === 0) ? 'left' : 'right';

    // Hàm xử lý sau khi có ảnh (hoặc không có ảnh)
    const processSave = (base64Img) => {
        addMemoryToDOM(title, text, base64Img, side);
        
        // Lưu vào localStorage
        const memories = JSON.parse(localStorage.getItem('timelineMemories')) || [];
        memories.push({ title, text, img: base64Img, side });
        localStorage.setItem('timelineMemories', JSON.stringify(memories));

        // Reset form
        document.getElementById('memory-title').value = '';
        document.getElementById('memory-text').value = '';
        document.getElementById('memory-image').value = '';
        closeModal('memory-modal');
        memoryCount++;
    };

    // Đọc file ảnh thành Base64
    if (imageFile) {
        if (imageFile.size > 1024 * 1024) {
            alert('Ảnh quá lớn! Vui lòng chọn ảnh dưới 1MB để web chạy mượt.');
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => processSave(e.target.result);
        reader.readAsDataURL(imageFile);
    } else {
        processSave(null);
    }
});

// Tải kỷ niệm đã lưu khi mở web
function loadMemories() {
    const memories = JSON.parse(localStorage.getItem('timelineMemories')) || [];
    memories.forEach(mem => {
        addMemoryToDOM(mem.title, mem.text, mem.img, mem.side);
        memoryCount++;
    });
}
loadMemories();

// --- CHỨC NĂNG: LỜI CHÚC ---
const wishModal = document.getElementById('wish-modal');
const openWishBtn = document.getElementById('open-wish-btn');
const sendWishBtn = document.getElementById('send-wish-btn');
const wishesContainer = document.getElementById('wishes-container');

openWishBtn.addEventListener('click', () => wishModal.classList.add('active'));

function addWishToDOM(name, text) {
    const card = document.createElement('div');
    card.className = 'wish-card';
    card.innerHTML = `<p>"${text}"</p><span>- ${name}</span>`;
    wishesContainer.appendChild(card);
}

sendWishBtn.addEventListener('click', () => {
    const name = document.getElementById('wish-name').value.trim();
    const text = document.getElementById('wish-text').value.trim();

    if (!name || !text) {
        alert('Vui lòng nhập đầy đủ tên và lời chúc nhé!');
        return;
    }

    addWishToDOM(name, text);
    
    const savedWishes = JSON.parse(localStorage.getItem('teacherWishes')) || [];
    savedWishes.push({ name, text });
    localStorage.setItem('teacherWishes', JSON.stringify(savedWishes));

    document.getElementById('wish-name').value = '';
    document.getElementById('wish-text').value = '';
    closeModal('wish-modal');
});

function loadWishes() {
    const savedWishes = JSON.parse(localStorage.getItem('teacherWishes')) || [];
    savedWishes.forEach(wish => addWishToDOM(wish.name, wish.text));
}
loadWishes();

// --- CHỨC NĂNG: NHẠC VÀ ĐÈN LỒNG ---
let isPlaying = false;
function toggleMusic() {
    const music = document.getElementById('bg-music');
    const btn = document.getElementById('music-btn');
    if (isPlaying) {
        music.pause();
        btn.innerHTML = '<i class="fas fa-music"></i>';
    } else {
        music.play();
        btn.innerHTML = '<i class="fas fa-pause"></i>';
    }
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