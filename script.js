// Custom JavaScript for DEPOK

document.addEventListener('DOMContentLoaded', () => {

    // --- 0. SPLASH SCREEN ---
    const splash = document.getElementById('splash-screen');
    if (splash) {
        setTimeout(() => {
            splash.classList.add('opacity-0');
            setTimeout(() => splash.remove(), 1000); // Wait for transition
        }, 2000); // 2 seconds delay
    }

    console.log('DEPOK initialized.');
    
    // Elements
    const btnTitipCapek = document.getElementById('btn-titip-capek');
    const step3Section = document.getElementById('step3-bubbles');
    const bubbles = document.querySelectorAll('.bubble-btn');
    
    const modal = document.getElementById('healing-modal');
    const modalContentBox = document.getElementById('modal-content-box');
    const modalGif = document.getElementById('modal-gif');
    const modalText = document.getElementById('modal-text');
    const closeModal = document.getElementById('close-modal');

    // Data for Bubbles
    const healingData = {
        'overthinking': {
            gif: 'nailong_gift/nailong_pusing.gif',
            text: "Otak kamu akhirnya istirahat. Nailong juga gak sanggup mikirin tagihan!"
        },
        'kerjaan': {
            gif: 'nailong_gift/nailong_lari.gif',
            text: "Nailong aja pingsan mikirin kerjaanmu! Libur dulu gakk!"
        },
        'tanggungjawab': {
            gif: 'nailong_gift/nailong_tepuk_tangan.gif',
            text: "Puk-puk. Sini, Nailong temenin 'istirahat' yang aman. Kamu ga harus gendong semuanya sendirian."
        }
    };

    // 1. Scroll and Show Step 3 when Button Clicked
    if (btnTitipCapek && step3Section) {
        btnTitipCapek.addEventListener('click', () => {
            step3Section.classList.remove('hidden');
            step3Section.classList.add('flex');
            
            // PROGRESSIVE DISCLOSURE: Unlock Bubbles, Hide Lock
            const lockBubbles = document.getElementById('lock-bubbles');
            if(lockBubbles) lockBubbles.classList.add('hidden');
            
            const lockRage = document.getElementById('lock-rage');
            if(lockRage) {
                lockRage.classList.remove('hidden');
                lockRage.classList.add('block');
            }
            
            // Allow display change to register before scrolling
            setTimeout(() => {
                step3Section.scrollIntoView({ behavior: 'smooth' });
            }, 50);
        });
    }

    // 2. Bubble Click Interactions
    bubbles.forEach(bubble => {
        bubble.addEventListener('click', function() {
            const type = this.getAttribute('data-type');
            
            // Pop animation
            this.classList.remove('animate-float-slow', 'animate-float-medium', 'animate-float-fast');
            this.classList.add('animate-pop');
            
            setTimeout(() => {
                // Set Modal Content
                modalGif.src = healingData[type].gif;
                modalText.innerText = healingData[type].text;
                
                // Show Modal Base
                modal.classList.remove('hidden');
                modal.classList.add('flex');
                
                // Trigger Fade-in and Scale for Modal
                setTimeout(() => {
                    modal.classList.remove('opacity-0');
                    modal.classList.add('opacity-100');
                    modalContentBox.classList.remove('scale-95');
                    modalContentBox.classList.add('scale-100');
                }, 10);
            }, 300); // Wait for bubble pop animation to finish
        });
    });

    // 3. Close Modal Interactions
    if (closeModal && modal) {
        closeModal.addEventListener('click', () => {
            // Reverse animations
            modal.classList.remove('opacity-100');
            modal.classList.add('opacity-0');
            modalContentBox.classList.remove('scale-100');
            modalContentBox.classList.add('scale-95');
            
            setTimeout(() => {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
                
                // Respawn bubbles (optional, keeping it playful)
                bubbles.forEach(b => {
                    b.classList.remove('animate-pop');
                    // re-add a random float class to bring them back
                    const floats = ['animate-float-slow', 'animate-float-medium', 'animate-float-fast'];
                    const randomFloat = floats[Math.floor(Math.random() * floats.length)];
                    b.classList.add(randomFloat);
                });
                // PROGRESSIVE DISCLOSURE: Unlock Rage
                const rageSection = document.getElementById('rage-section');
                const lockRage = document.getElementById('lock-rage');
                const lockTools = document.getElementById('lock-tools');
                
                if (rageSection && rageSection.classList.contains('hidden')) {
                    if (lockRage) lockRage.classList.add('hidden');
                    rageSection.classList.remove('hidden');
                    rageSection.classList.add('flex');
                    if (lockTools) {
                        lockTools.classList.remove('hidden');
                        lockTools.classList.add('block');
                    }
                    setTimeout(() => rageSection.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
                }
            }, 300);
        });
    }

    // --- ACTIVITY TRACKER (Remote Vercel KV) ---
    const updateStat = (key, value = 1) => {
        // Send silently in the background
        fetch('/api/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key, value })
        }).catch(err => console.log('Tracker silent fail (API might not be ready)', err));
    };

    // Integrate tracking into existing buttons
    if (btnTitipCapek) {
        btnTitipCapek.addEventListener('click', () => updateStat('hero_clicks'));
    }

    bubbles.forEach(bubble => {
        bubble.addEventListener('click', function() {
            const type = this.getAttribute('data-type');
            if(type === 'overthinking') updateStat('bubble_overthinking');
            if(type === 'kerjaan') updateStat('bubble_kerjaan');
            if(type === 'tanggungjawab') updateStat('bubble_tanggungjawab');
        });
    });

    // --- SECRET ADMIN MODAL ---
    const logoTitle = document.getElementById('logo-title');
    const adminModal = document.getElementById('admin-modal');
    const closeAdmin = document.getElementById('close-admin');
    const adminStats = document.getElementById('admin-stats');
    const btnResetStats = document.getElementById('btn-reset-stats');
    
    let logoClicks = 0;
    let logoClickTimer;

    if (logoTitle) {
        logoTitle.addEventListener('click', () => {
            logoClicks++;
            clearTimeout(logoClickTimer);
            
            if (logoClicks >= 5) {
                logoClicks = 0;
                // Add password prompt for extra security
                const pwd = prompt("Akses Terkunci. Masukkan password:");
                
                if (pwd === "qorinalucu" || pwd === "admin") {
                    // Show Admin Modal
                    renderAdminStats();
                    adminModal.classList.remove('hidden');
                    adminModal.classList.add('flex');
                } else {
                    if (pwd !== null) {
                        alert("Password salah!");
                    }
                }
            } else {
                logoClickTimer = setTimeout(() => { logoClicks = 0; }, 2000);
            }
        });
    }

    if (closeAdmin) {
        closeAdmin.addEventListener('click', () => {
            adminModal.classList.add('hidden');
            adminModal.classList.remove('flex');
        });
    }

    if (btnResetStats) {
        btnResetStats.addEventListener('click', () => {
            alert('Fitur Reset dinonaktifkan pada mode Remote Database demi keamanan.');
        });
    }

    async function renderAdminStats() {
        if(adminStats) {
            adminStats.innerHTML = `<p class="text-center text-blue-500 animate-pulse">Menghubungkan ke satelit Qorina...</p>`;
            try {
                const [resStats, resMsgs] = await Promise.all([
                    fetch('/api/stats'),
                    fetch('/api/messages')
                ]);
                
                const stats = await resStats.json();
                const msgs = resMsgs.ok ? await resMsgs.json() : [];
                
                if (stats._error) {
                    adminStats.innerHTML = `<p class="text-red-500 text-center font-bold">${stats._error}</p><p class="text-xs text-center mt-2 text-gray-500">Anda harus menghubungkan Vercel KV Storage di dasbor Vercel.</p>`;
                    return;
                }

                let html = `
                    <div class="flex justify-between border-b pb-1"><span>Klik Tombol Hero:</span> <span class="font-bold">${stats.hero_clicks || 0}x</span></div>
                    <div class="flex justify-between border-b pb-1"><span>Pecah Bubble (Overthinking):</span> <span class="font-bold">${stats.bubble_overthinking || 0}x</span></div>
                    <div class="flex justify-between border-b pb-1"><span>Pecah Bubble (Kerjaan):</span> <span class="font-bold">${stats.bubble_kerjaan || 0}x</span></div>
                    <div class="flex justify-between border-b pb-1"><span>Pecah Bubble (Tgjawab):</span> <span class="font-bold">${stats.bubble_tanggungjawab || 0}x</span></div>
                    <div class="flex justify-between border-b pb-1"><span>Total Pukulan Emosi:</span> <span class="font-bold">${stats.rage_clicks || 0}x</span></div>
                    <div class="flex justify-between border-b pb-1 text-orange-600"><span>Bakar Curhatan:</span> <span class="font-bold">${stats.trash_usage || 0}x</span></div>
                    <div class="flex justify-between border-b pb-1 text-blue-600"><span>Pakai Scanner Hati:</span> <span class="font-bold">${stats.scanner_usage || 0}x</span></div>
                    <div class="flex justify-between border-b pb-1 text-purple-600"><span>Panggil Hujan Nailong:</span> <span class="font-bold">${stats.confetti_clicks || 0}x</span></div>
                `;

                // Append messages UI
                html += '<h3 class="font-bold text-md mt-6 mb-2 text-orange-600 border-b border-orange-200">Isi Kotak Curhat Ajaib:</h3>';
                if (msgs.length === 0) {
                    html += '<p class="text-sm text-gray-500 italic">Belum ada curhatan.</p>';
                } else {
                    html += '<div class="max-h-48 overflow-y-auto bg-gray-50 p-3 rounded-xl border border-gray-200 text-sm text-left flex flex-col gap-2">';
                    msgs.forEach(m => {
                        html += `
                            <div class="pb-2 border-b border-gray-200 last:border-0 last:pb-0">
                                <span class="text-[10px] text-gray-400 block mb-1">${m.time}</span>
                                <span class="text-gray-800 break-words">${m.text.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</span>
                            </div>
                        `;
                    });
                    html += '</div>';
                }

                adminStats.innerHTML = html;
            } catch (err) {
                adminStats.innerHTML = `<p class="text-red-500 text-center">Gagal menyambung ke server Vercel.</p>`;
            }
        }
    }

    // --- RAGE CLICK AREA ---
    const btnRage = document.getElementById('btn-rage');
    const rageBar = document.getElementById('rage-bar');
    const rageText = document.getElementById('rage-text');
    const rageSuccess = document.getElementById('rage-success');
    let rageProgress = 0;
    const clicksNeeded = 20;

    if (btnRage) {
        btnRage.addEventListener('click', function() {
            if (rageProgress >= 100) return; // Already full

            updateStat('rage_clicks');

            // Increase progress
            rageProgress += (100 / clicksNeeded);
            if (rageProgress > 100) rageProgress = 100;

            // Update UI
            rageBar.style.width = `${rageProgress}%`;
            rageText.innerText = `${Math.floor(rageProgress)}%`;

            // Shake button
            this.classList.remove('animate-shake');
            void this.offsetWidth; // trigger reflow
            this.classList.add('animate-shake');

            // Check win condition
            if (rageProgress >= 100) {
                this.classList.add('hidden');
                document.querySelector('#rage-section > p').classList.add('hidden'); // hide instructions
                rageSuccess.classList.remove('hidden');
                rageSuccess.classList.add('flex');
                rageText.innerText = '100% - EMOSI HILANG!';
                rageBar.classList.remove('from-red-400', 'to-red-600');
                rageBar.classList.add('from-green-400', 'to-green-600');

                // PROGRESSIVE DISCLOSURE: Unlock Tools
                const toolsSection = document.getElementById('interactive-tools');
                const lockTools = document.getElementById('lock-tools');
                const lockGallery = document.getElementById('lock-gallery');
                
                if (toolsSection && toolsSection.classList.contains('hidden')) {
                    if (lockTools) lockTools.classList.add('hidden');
                    toolsSection.classList.remove('hidden');
                    toolsSection.classList.add('grid'); // it's a grid container
                    if (lockGallery) {
                        lockGallery.classList.remove('hidden');
                        lockGallery.classList.add('block');
                    }
                    setTimeout(() => toolsSection.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300);
                }
            }
        });
    }



    // --- 2. RANDOM TOASTS ---
    const toastContainer = document.getElementById('toast-container');
    const toastMessages = [
        "Heh, senyum dong! Jangan ditekuk terus mukanya 😝",
        "Udah minum air putih belum? Ntar dehidrasi loh!",
        "Kalo capek istirahat, jangan dipaksain terus...",
        "Nailong selalu ada buat Qorina! 💛",
        "Nggak apa-apa kok kalau hari ini ngerasa berat.",
        "Makan yang enak ya hari ini, kamu pantas dapetin itu!"
    ];

    function showRandomToast() {
        if (!toastContainer) return;
        const msg = toastMessages[Math.floor(Math.random() * toastMessages.length)];
        const toast = document.createElement('div');
        toast.className = 'bg-white p-4 rounded-2xl shadow-lg border-2 border-yellow-200 text-gray-800 font-medium text-sm max-w-xs transform translate-x-full transition-transform duration-500 flex items-center gap-3';
        toast.innerHTML = `<img src="nailong_gift/nailong_pipi_gemas.gif" class="w-10 h-10 rounded-full object-cover"> <span>${msg}</span>`;
        
        toastContainer.appendChild(toast);
        
        // Slide in
        setTimeout(() => toast.classList.remove('translate-x-full'), 100);
        
        // Slide out & remove
        setTimeout(() => {
            toast.classList.add('translate-x-full');
            setTimeout(() => toast.remove(), 500);
        }, 5000);
    }
    // Show a toast every 25 seconds
    setInterval(showRandomToast, 25000);

    // --- 3. MAGIC TRASH BIN ---
    const btnTrash = document.getElementById('btn-trash');
    const trashInput = document.getElementById('trash-input');
    const trashSuccess = document.getElementById('trash-success');
    const btnTrashReset = document.getElementById('btn-trash-reset');

    if (btnTrash) {
        btnTrash.addEventListener('click', () => {
            const text = trashInput.value.trim();
            if (text === '') return alert('Isi dulu dong uneg-unegnya!');
            
            updateStat('trash_usage');
            
            // Simpan curhatan ke database rahasia
            fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text })
            }).catch(e => console.log('Tracker silent fail', e));
            
            // Animation for text area
            trashInput.style.transition = 'all 0.5s';
            trashInput.style.transform = 'scale(0.8) rotate(5deg)';
            trashInput.style.opacity = '0';
            
            setTimeout(() => {
                trashSuccess.classList.remove('hidden');
                trashSuccess.classList.add('flex');
                unlockGallery();
            }, 600);
        });
        
        btnTrashReset.addEventListener('click', () => {
            trashInput.value = '';
            trashInput.style.transform = 'scale(1) rotate(0deg)';
            trashInput.style.opacity = '1';
            trashSuccess.classList.add('hidden');
            trashSuccess.classList.remove('flex');
        });
    }

    // --- 4. FAKE SCANNER ---
    const btnScan = document.getElementById('btn-scan');
    const scanLoading = document.getElementById('scan-loading');
    const scanResult = document.getElementById('scan-result');
    const btnScanReset = document.getElementById('btn-scan-reset');

    if (btnScan) {
        btnScan.addEventListener('click', () => {
            updateStat('scanner_usage');
            scanLoading.classList.remove('hidden');
            setTimeout(() => {
                scanLoading.classList.add('hidden');
                scanResult.classList.remove('hidden');
                scanResult.classList.add('flex');
                unlockGallery();
            }, 2000);
        });

        btnScanReset.addEventListener('click', () => {
            scanResult.classList.add('hidden');
            scanResult.classList.remove('flex');
        });
    }



    // --- 6. PANIC BUTTON (SOS) ---
    const btnPanic = document.getElementById('btn-panic');
    const panicModal = document.getElementById('panic-modal');
    const closePanic = document.getElementById('close-panic');
    const panicTextEl = document.getElementById('panic-text');
    
    const sosMessages = [
        "Hei...",
        "Lagi capek banget ya hari ini?",
        "Nggak apa-apa kok kalau ngerasa gagal atau lelah.",
        "Kamu udah bertahan sejauh ini, itu hebat banget loh.",
        "Sini, sandaran dulu.",
        "Tarik nafas pelan-pelan...",
        "Aku temenin sampai kamu tenang. 💛"
    ];
    let typeInterval, msgTimeout;

    if (btnPanic && panicModal) {
        btnPanic.addEventListener('click', () => {
            panicModal.classList.remove('hidden');
            panicModal.classList.add('flex');
            setTimeout(() => panicModal.classList.remove('opacity-0'), 10);
            
            panicTextEl.innerHTML = '';
            closePanic.classList.remove('opacity-100');
            closePanic.classList.add('opacity-0');
            closePanic.disabled = true;

            let msgIndex = 0;
            
            function typeWriter() {
                if (msgIndex >= sosMessages.length) {
                    setTimeout(() => {
                        closePanic.disabled = false;
                        closePanic.classList.remove('opacity-0');
                        closePanic.classList.add('opacity-100');
                    }, 1000);
                    return;
                }
                
                const currentMsg = sosMessages[msgIndex];
                let charIndex = 0;
                panicTextEl.innerHTML = '';
                
                clearInterval(typeInterval);
                typeInterval = setInterval(() => {
                    if (charIndex < currentMsg.length) {
                        panicTextEl.innerHTML += currentMsg.charAt(charIndex);
                        charIndex++;
                    } else {
                        clearInterval(typeInterval);
                        msgIndex++;
                        msgTimeout = setTimeout(typeWriter, 2000); // Wait 2s before next msg
                    }
                }, 80); // Typing speed
            }
            
            setTimeout(typeWriter, 1500); // Initial delay
        });

        closePanic.addEventListener('click', () => {
            panicModal.classList.add('opacity-0');
            clearInterval(typeInterval);
            clearTimeout(msgTimeout);
            setTimeout(() => {
                panicModal.classList.add('hidden');
                panicModal.classList.remove('flex');
            }, 1000);
        });
    }

    // --- PROGRESSIVE DISCLOSURE: Unlock Gallery ---
    function unlockGallery() {
        const gallerySection = document.getElementById('gallery-section');
        const lockGallery = document.getElementById('lock-gallery');
        const lockClosing = document.getElementById('lock-closing');
        
        if (gallerySection && gallerySection.classList.contains('hidden')) {
            if (lockGallery) lockGallery.classList.add('hidden');
            gallerySection.classList.remove('hidden');
            gallerySection.classList.add('flex');
            if (lockClosing) {
                lockClosing.classList.remove('hidden');
                lockClosing.classList.add('block');
            }
            setTimeout(() => gallerySection.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300);
        }
    }

    // --- 7. EASTER EGG: NAILONG RAIN (AND FINAL UNLOCK) ---
    const btnConfetti = document.getElementById('btn-confetti');

    if (btnConfetti) {
        btnConfetti.addEventListener('click', () => {
            updateStat('confetti_clicks');
            triggerNailongRain();
            
            // Unlock Closing Section
            const closingSection = document.getElementById('closing-section');
            const btnPanicFinal = document.getElementById('btn-panic');
            const lockClosing = document.getElementById('lock-closing');
            
            if (closingSection && closingSection.classList.contains('hidden')) {
                if (lockClosing) lockClosing.classList.add('hidden');
                
                closingSection.classList.remove('hidden');
                closingSection.classList.add('flex');
                
                btnPanicFinal.classList.remove('hidden');
                btnPanicFinal.classList.add('flex'); // btn-panic uses flex-col, but flex class handles it
                
                setTimeout(() => closingSection.scrollIntoView({ behavior: 'smooth', block: 'end' }), 1000);
            }
        });
    }

    function triggerNailongRain() {
        const gifs = [
            'nailong_makan_donat.gif', 
            'nailong_jalan_jalan.gif', 
            'nailong_tatapan_imut.gif', 
            'nailoong_joget.gif', 
            'nailong_dance.gif', 
            'nailong_pipi_gemas.gif', 
            'Nailong GIF.gif'
        ];
        
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const img = document.createElement('img');
                const randomGif = gifs[Math.floor(Math.random() * gifs.length)];
                img.src = `nailong_gift/${randomGif}`;
                img.className = 'nailong-rain-drop object-contain';
                
                // Random size, position, and duration
                const size = Math.random() * 40 + 40; // 40px to 80px
                const left = Math.random() * 100; // 0 to 100vw
                const duration = Math.random() * 2 + 2; // 2s to 4s
                
                img.style.width = `${size}px`;
                img.style.height = `${size}px`;
                img.style.left = `${left}vw`;
                img.style.animationDuration = `${duration}s`;
                
                document.body.appendChild(img);
                
                // Cleanup after falling
                setTimeout(() => img.remove(), duration * 1000);
            }, i * 50); // Stagger drops by 50ms
        }
    }

});
