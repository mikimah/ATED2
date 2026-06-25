const goToTopBtn = document.getElementById("goToTopBtn");
// 1. Đặt thời gian đích đếm ngược theo giờ Việt Nam (UTC+7)
const targetDateTime = new Date("2026-10-29T00:00:00+07:00");
const TARGET_DATE = targetDateTime.getTime();

function executeFlip(cardElement, newNumber) {
  const topHalf = cardElement.querySelector(".top");
  const bottomHalf = cardElement.querySelector(".bottom");
  const currentNumber = topHalf.getAttribute("data-num");

  // Nếu số không đổi (ví dụ hàng chục của phút) thì bỏ qua không tạo hiệu ứng lật
  if (currentNumber === String(newNumber)) return;

  // Tạo 2 mảnh giấy hiệu ứng lật đè lên trên
  const topFlip = document.createElement("div");
  topFlip.classList.add("card-half", "top", "top-flip");
  topFlip.setAttribute("data-num", currentNumber);

  const bottomFlip = document.createElement("div");
  bottomFlip.classList.add("card-half", "bottom", "bottom-flip");
  bottomFlip.setAttribute("data-num", newNumber);

  // Cập nhật giá trị số mới cho mảnh giấy gốc ẩn phía sau
  topHalf.setAttribute("data-num", newNumber);

  bottomFlip.addEventListener("animationend", () => {
    bottomHalf.setAttribute("data-num", newNumber);
    bottomFlip.remove();
  });

  cardElement.appendChild(topFlip);
  cardElement.appendChild(bottomFlip);

  setTimeout(() => {
    topFlip.remove();
  }, 500);
}

function updateSegment(tensId, onesId, totalValue) {
  const tensValue = Math.floor(totalValue / 10);
  const onesValue = totalValue % 10;

  executeFlip(document.getElementById(tensId), tensValue);
  executeFlip(document.getElementById(onesId), onesValue);
}

function runTimer() {
  // Lấy thời gian hiện tại theo giờ Việt Nam
  const now = new Date();
  const vietnamTime = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" }),
  );
  const remainTime = TARGET_DATE - vietnamTime.getTime();

  if (remainTime <= 0) {
    updateSegment("w-tens", "w-ones", 0);
    updateSegment("d-tens", "d-ones", 0);
    updateSegment("h-tens", "h-ones", 0);
    updateSegment("m-tens", "m-ones", 0);
    updateSegment("s-tens", "s-ones", 0);
    clearInterval(timerInterval);
    return;
  }

  // Trích xuất toán học tuần, ngày, giờ, phút, giây
  const weeks = Math.floor(remainTime / (1000 * 60 * 60 * 24 * 7));
  const days = Math.floor(
    (remainTime % (1000 * 60 * 60 * 24 * 7)) / (1000 * 60 * 60 * 24),
  );
  const hours = Math.floor(
    (remainTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  const minutes = Math.floor((remainTime % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((remainTime % (1000 * 60)) / 1000);

  // Đẩy số vào các hàm xử lý lật
  updateSegment("w-tens", "w-ones", weeks);
  updateSegment("d-tens", "d-ones", days);
  updateSegment("h-tens", "h-ones", hours);
  updateSegment("m-tens", "m-ones", minutes);
  updateSegment("s-tens", "s-ones", seconds);
}

function scrollToSection(id) {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
    window.history.replaceState(null, null, window.location.pathname);
  }
}

// Show/Hide Go to Top button

window.addEventListener("scroll", function () {
  if (window.scrollY > 300) {
    goToTopBtn.style.display = "flex";
  } else {
    goToTopBtn.style.display = "none";
  }
});

// Khởi chạy vòng lặp cập nhật mỗi 1 giây
const timerInterval = setInterval(runTimer, 1000);
runTimer(); // Chạy ngay lập tức lần đầu khi load trang

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      // 🛠️ Dùng querySelectorAll để lấy TẤT CẢ thẻ con có class .animation
      const children = entry.target.querySelectorAll(".animation");

      if (entry.isIntersecting) {
        // Duyệt qua từng thẻ con để vứt class "show" vào
        children.forEach((child) => {
          child.classList.add("show");
        });
      } else {
        // Cuộn lên thì ẩn đi (Tùy chọn)
        // children.forEach((child) => {
        //   child.classList.remove('show');
        // });
      }
    });
  },
  { threshold: window.innerWidth < 768 ? 0.1 : 0.45 },
);

// Theo dõi các thẻ cha
document
  .querySelectorAll(".parent-box")
  .forEach((box) => observer.observe(box));
