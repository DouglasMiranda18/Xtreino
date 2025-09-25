// Firebase Configuration - CONFIGURADO
const firebaseConfig = {
    apiKey: "AIzaSyANtE6Xd-_SdV0AOZ52T7MXEJ0a-Cksj4w",
    authDomain: "supernatural-51e12.firebaseapp.com",
    projectId: "supernatural-51e12",
    storageBucket: "supernatural-51e12.firebasestorage.app",
    messagingSenderId: "1030063599704",
    appId: "1:1030063599704:web:aff395634cf9828cd2da2d",
    measurementId: "G-WYXXRKDZ7X"
};

// Mercado Pago Configuration - CONFIGURE SUAS CREDENCIAIS AQUI
const MERCADO_PAGO_ACCESS_TOKEN = "APP_USR-2213099347690266-092212-ea57e6a3c5868f4d00fdd302c7bcb537-2018162925";
const MERCADO_PAGO_BASE_URL = "https://api.mercadopago.com"; // base API
const ADMIN_WHATSAPP = "5511999999999"; // Altere para o WhatsApp oficial

// Initialize Firebase
let db;
const isPlaceholderFirebaseConfig = (
    !firebaseConfig ||
    firebaseConfig.projectId === 'seu-projeto-id' ||
    firebaseConfig.apiKey === 'SUA_API_KEY_AQUI'
);

try {
    if (isPlaceholderFirebaseConfig) {
        console.warn('Firebase não configurado: substitua as credenciais em script.js. Conexões foram desativadas para evitar erros.');
    } else {
        firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
        console.log("Firebase conectado com sucesso!");
    }
} catch (error) {
    console.error("Erro ao conectar Firebase:", error);
    showNotification("Erro ao conectar com o banco de dados", "error");
}

// Global variables
let currentSchedule = null;
let isAdminLoggedIn = false;
let registrations = [];
let ranking = [];
let results = [];

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    loadAgenda();
    loadRanking();
    showSection('agenda');
    setupRealtimeListeners();
    handleMercadoPagoReturn();
});

function setupEventListeners() {
    // Mobile menu toggle
    document.getElementById('mobileMenuBtn').addEventListener('click', function() {
        const mobileMenu = document.getElementById('mobileMenu');
        mobileMenu.classList.toggle('hidden');
    });
}

function setupRealtimeListeners() {
    // Real-time listeners for Firebase
    if (db) {
        db.collection('registrations').onSnapshot((snapshot) => {
            registrations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            updateAgendaDisplay();
            updateAdminStats();
        }, (error) => {
            console.warn("Permissão insuficiente ao escutar 'registrations'. Verifique as regras do Firestore.");
        });

        db.collection('ranking').onSnapshot((snapshot) => {
            ranking = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            displayRanking();
        }, (error) => {
            console.warn("Permissão insuficiente ao escutar 'ranking'. Verifique as regras do Firestore.");
        });

        db.collection('results').onSnapshot((snapshot) => {
            results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            displayTabelas();
        }, (error) => {
            console.warn("Permissão insuficiente ao escutar 'results'. Verifique as regras do Firestore.");
        });
    } else {
        console.warn('Listeners em tempo real desativados: Firebase não configurado.');
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="flex items-center">
            <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'exclamation-triangle' : 'info-circle'} mr-3"></i>
            ${message}
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => document.body.removeChild(notification), 300);
    }, 5000);
}

function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('hidden');
    });

    // Show selected section
    document.getElementById(sectionName + 'Section').classList.remove('hidden');

    // Hide mobile menu
    document.getElementById('mobileMenu').classList.add('hidden');
}

function loadAgenda() {
    const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const times = ['19h', '20h', '21h', '22h', '23h'];
    const agendaGrid = document.getElementById('agendaGrid');
    
    agendaGrid.innerHTML = '';

    days.forEach(day => {
        times.forEach(time => {
            const schedule = `${day} - ${time}`;
            const occupiedSlots = registrations.filter(reg => 
                reg.schedule === schedule && reg.status === 'confirmed'
            ).length;
            const availableSlots = 12 - occupiedSlots;

            const card = document.createElement('div');
            card.className = 'glass-effect rounded-3xl p-8 card-hover cursor-pointer neon-border relative overflow-hidden';
            card.onclick = () => openRegistrationModal(schedule);

            card.innerHTML = `
                <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-500/20 to-transparent rounded-bl-full"></div>
                <div class="relative z-10">
                    <div class="flex justify-between items-start mb-8">
                        <div>
                            <h3 class="font-black text-3xl text-white mb-2">${day.toUpperCase()}</h3>
                            <p class="text-orange-400 font-black text-2xl">${time}</p>
                        </div>
                        <div class="text-right">
                            <p class="text-sm text-gray-400 uppercase tracking-wider font-semibold">Vagas</p>
                            <p class="text-4xl font-black ${availableSlots > 0 ? 'text-green-400' : 'text-red-400'}">
                                ${availableSlots}<span class="text-gray-500">/12</span>
                            </p>
                        </div>
                    </div>
                    
                    <div class="space-y-4 mb-8">
                        <div class="flex justify-between items-center p-3 bg-black/30 rounded-xl">
                            <span class="text-gray-300 flex items-center font-semibold"><i class="fas fa-map mr-3 text-orange-500"></i>Bermuda</span>
                            <span class="text-orange-400 font-bold">Queda 1</span>
                        </div>
                        <div class="flex justify-between items-center p-3 bg-black/30 rounded-xl">
                            <span class="text-gray-300 flex items-center font-semibold"><i class="fas fa-fire mr-3 text-red-500"></i>Purgatório</span>
                            <span class="text-red-400 font-bold">Queda 2</span>
                        </div>
                        <div class="flex justify-between items-center p-3 bg-black/30 rounded-xl">
                            <span class="text-gray-300 flex items-center font-semibold"><i class="fas fa-mountain mr-3 text-yellow-500"></i>Kalahari</span>
                            <span class="text-yellow-400 font-bold">Queda 3</span>
                        </div>
                    </div>
                    
                    <div class="flex justify-between items-center">
                        <div class="text-left">
                            <p class="text-sm text-gray-400 uppercase tracking-wider font-semibold">Valor</p>
                            <p class="text-3xl font-black text-green-400">R$ 0,50</p>
                        </div>
                        <div class="flex space-x-3">
                            <button onclick="event.stopPropagation(); openTeamsModal('${schedule}')" class="bg-gray-700 hover:bg-gray-600 text-white px-5 py-4 rounded-xl transition-colors font-black uppercase tracking-wider text-sm">
                                VER TIMES
                            </button>
                            <button class="${availableSlots === 0 ? 'bg-gray-600 cursor-not-allowed' : 'gradient-bg hover:from-orange-600 hover:to-red-600 glow-effect'} text-white px-8 py-4 rounded-xl transition-all font-black uppercase tracking-wider text-lg" 
                                    ${availableSlots === 0 ? 'disabled' : ''}>
                                ${availableSlots === 0 ? 'LOTADO' : 'INSCREVER'}
                            </button>
                        </div>
                    </div>
                </div>
            `;

            agendaGrid.appendChild(card);
        });
    });
}

function updateAgendaDisplay() {
    loadAgenda();
}
function openTeamsModal(schedule) {
    const teams = registrations
        .filter(reg => reg.schedule === schedule && reg.status === 'confirmed')
        .map(reg => reg.teamName)
        .sort((a, b) => a.localeCompare(b));

    const content = document.getElementById('teamsContent');
    if (!teams.length) {
        content.innerHTML = `<p class="text-gray-300">Nenhum time confirmado ainda para <strong class="text-orange-400">${schedule}</strong>.</p>`;
    } else {
        content.innerHTML = `
            <p class="text-gray-300 mb-4">Horário: <strong class="text-orange-400">${schedule}</strong></p>
            <ul class="space-y-2">
                ${teams.map((name, idx) => `<li class="text-white">${idx + 1}. ${name}</li>`).join('')}
            </ul>
        `;
    }
    document.getElementById('teamsModal').classList.remove('hidden');
}

function closeTeamsModal() {
    document.getElementById('teamsModal').classList.add('hidden');
}

function openRegistrationModal(schedule) {
    const occupiedSlots = registrations.filter(reg => 
        reg.schedule === schedule && reg.status === 'confirmed'
    ).length;
    
    if (occupiedSlots >= 12) {
        showNotification('Este horário está lotado!', 'error');
        return;
    }

    currentSchedule = schedule;
    document.getElementById('selectedTime').textContent = schedule;
    document.getElementById('registrationModal').classList.remove('hidden');
}

function closeRegistrationModal() {
    document.getElementById('registrationModal').classList.add('hidden');
    document.getElementById('registrationForm').reset();
    currentSchedule = null;
    
    // Reset button state
    const btn = document.getElementById('registerBtn');
    const btnText = document.getElementById('registerBtnText');
    const btnSpinner = document.getElementById('registerBtnSpinner');
    
    btn.disabled = false;
    btnText.classList.remove('hidden');
    btnSpinner.classList.add('hidden');
}

async function registerTeam(event) {
    event.preventDefault();
    if (!db) {
        showNotification('Backend não configurado. Configure o Firebase antes de continuar.', 'error');
        return;
    }
    
    const teamName = document.getElementById('teamName').value.trim();
    const teamPhone = document.getElementById('teamPhone').value.trim();
    const teamEmail = document.getElementById('teamEmail').value.trim();

    // Validate inputs
    if (!teamName || !teamPhone || !teamEmail) {
        showNotification('Preencha todos os campos!', 'error');
        return;
    }

    // Show loading state
    const btn = document.getElementById('registerBtn');
    const btnText = document.getElementById('registerBtnText');
    const btnSpinner = document.getElementById('registerBtnSpinner');
    
    btn.disabled = true;
    btnText.classList.add('hidden');
    btnSpinner.classList.remove('hidden');

    try {
        // Check if team already registered for this schedule (apenas se já temos dados)
        const existingRegistration = registrations.find(reg => 
            reg.teamName?.toLowerCase?.() === teamName.toLowerCase() && 
            reg.schedule === currentSchedule
        );

        if (existingRegistration) {
            showNotification('Este time já está inscrito neste horário!', 'error');
            return;
        }

        // Tenta salvar no Firestore, mas não bloqueia o fluxo se falhar por permissão
        let registrationId = 'local-' + Date.now();
        try {
            if (db) {
                const registrationData = {
                    teamName,
                    phone: teamPhone,
                    email: teamEmail,
                    schedule: currentSchedule,
                    status: 'pending',
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    paymentId: null,
                    paymentUrl: null
                };
                const docRef = await db.collection('registrations').add(registrationData);
                registrationId = docRef.id;
            }
        } catch (permErr) {
            console.warn('Sem permissão para gravar no Firestore. Seguindo sem persistir por enquanto.');
        }

        // Create payment with Mercado Pago
        const paymentData = await createMercadoPagoPayment({
            customer: {
                name: teamName,
                email: teamEmail,
                phone: teamPhone
            },
            value: 0.50,
            description: `X-Treino HARDKILLS - ${currentSchedule}`,
            externalReference: registrationId
        });

        if (paymentData.success) {
            // Guardar dados para retorno/pós-pagamento (WhatsApp e confirmação)
            try {
                localStorage.setItem('lastRegistrationId', registrationId);
                localStorage.setItem('lastRegistrationData', JSON.stringify({
                    teamName,
                    email: teamEmail,
                    phone: teamPhone,
                    schedule: currentSchedule
                }));
            } catch(_) {}
            try { localStorage.setItem('lastRegistrationId', registrationId); } catch(_) {}
            // Update registration with payment info, se possível
            try {
                if (db && !registrationId.startsWith('local-')) {
                    await db.collection('registrations').doc(registrationId).update({
                        paymentId: paymentData.payment.id,
                        paymentUrl: paymentData.payment.invoiceUrl
                    });
                }
            } catch(_) {}

            showNotification('Inscrição realizada com sucesso!', 'success');
            closeRegistrationModal();
            showPaymentModal(paymentData.payment);
        } else {
            throw new Error(paymentData.error || 'Erro ao criar pagamento');
        }

    } catch (error) {
        console.error('Erro ao inscrever time:', error);
        showNotification('Erro ao processar inscrição. Tente novamente.', 'error');
    } finally {
        // Reset button state
        btn.disabled = false;
        btnText.classList.remove('hidden');
        btnSpinner.classList.add('hidden');
    }
}

async function createMercadoPagoPayment(data) {
    if (!MERCADO_PAGO_ACCESS_TOKEN || MERCADO_PAGO_ACCESS_TOKEN === 'SEU_ACCESS_TOKEN_AQUI') {
        console.warn('Mercado Pago não configurado: defina MERCADO_PAGO_ACCESS_TOKEN.');
        return { success: false, error: 'Mercado Pago não configurado' };
    }
    try {
        // Create preference for Mercado Pago
        const baseReturnUrl = window.location.origin + window.location.pathname;
        const preferenceData = {
            items: [
                {
                    title: data.description,
                    quantity: 1,
                    unit_price: data.value,
                    currency_id: "BRL"
                }
            ],
            external_reference: data.externalReference,
            back_urls: {
                success: `${baseReturnUrl}?mp=success`,
                failure: `${baseReturnUrl}?mp=failure`,
                pending: `${baseReturnUrl}?mp=pending`
            },
            auto_return: "approved",
            payer: {
                name: data.customer.name,
                email: data.customer.email,
                phone: {
                    number: data.customer.phone
                }
            }
        };

        const response = await fetch(`${MERCADO_PAGO_BASE_URL}/checkout/preferences`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${MERCADO_PAGO_ACCESS_TOKEN}`
            },
            body: JSON.stringify(preferenceData)
        });

        if (response.ok) {
            const preference = await response.json();
            return { 
                success: true, 
                payment: {
                    id: preference.id,
                    invoiceUrl: preference.init_point
                }
            };
        } else {
            const error = await response.json();
            return { success: false, error: error.message || 'Erro no pagamento' };
        }

    } catch (error) {
        console.error('Erro na API Mercado Pago:', error);
        return { success: false, error: error.message };
    }
}

function showPaymentModal(payment) {
    const modal = document.getElementById('paymentModal');
    const content = document.getElementById('paymentContent');
    
    content.innerHTML = `
        <div class="text-center mb-6">
            <div class="bg-black/30 rounded-xl p-6 mb-6">
                <h4 class="text-orange-400 font-bold mb-2 uppercase tracking-wider">ID do Pagamento</h4>
                <p class="text-white font-mono text-sm">${payment.id}</p>
            </div>
            
            <div class="space-y-4">
                <a href="${payment.invoiceUrl}" target="_blank" rel="noopener noreferrer" 
                   class="block gradient-bg hover:from-orange-600 hover:to-red-600 text-white py-4 px-8 rounded-xl transition-all font-bold uppercase tracking-wider glow-effect">
                    <i class="fas fa-external-link-alt mr-3"></i>
                    PAGAR AGORA
                </a>
                
                <div class="text-sm text-gray-400">
                    <p>• Pagamento via PIX ou Cartão</p>
                    <p>• Confirmação automática</p>
                    <p>• Vencimento em 24 horas</p>
                </div>
            </div>
        </div>
    `;
    
    modal.classList.remove('hidden');
}

function closePaymentModal() {
    document.getElementById('paymentModal').classList.add('hidden');
}

function handleMercadoPagoReturn() {
    const params = new URLSearchParams(window.location.search);
    const mp = params.get('mp');
    if (!mp) return;

    const lastRegistrationId = (() => { try { return localStorage.getItem('lastRegistrationId'); } catch(_) { return null; } })();
    const lastRegistrationData = (() => { try { return JSON.parse(localStorage.getItem('lastRegistrationData') || 'null'); } catch(_) { return null; } })();
    if (mp === 'success') {
        showNotification('Pagamento aprovado! Sua inscrição foi confirmada.', 'success');
        if (db && lastRegistrationId && !lastRegistrationId.startsWith('local-')) {
            db.collection('registrations').doc(lastRegistrationId).update({ status: 'confirmed' }).catch(() => {});
        }
    } else if (mp === 'pending') {
        showNotification('Pagamento pendente. Assim que aprovar, confirmaremos sua vaga.', 'info');
        if (lastRegistrationData) {
            showPendingConfirmationModal(lastRegistrationData);
        }
    } else if (mp === 'failure') {
        showNotification('Pagamento não aprovado. Tente novamente.', 'error');
    }
    try { localStorage.removeItem('lastRegistrationId'); localStorage.removeItem('lastRegistrationData'); } catch(_) {}
    const cleanUrl = window.location.origin + window.location.pathname + window.location.hash;
    window.history.replaceState({}, document.title, cleanUrl);
}

function showPendingConfirmationModal(regData) {
    const modal = document.getElementById('paymentModal');
    const content = document.getElementById('paymentContent');

    const message = `Olá!\nSolicito a confirmação da vaga do X-Treino.\n\nTime: ${regData.teamName}\nEmail: ${regData.email}\nWhatsApp: ${regData.phone}\nHorário: ${regData.schedule}\n\nStatus do pagamento: PENDENTE (aguardando compensação).`;
    const waUrl = `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(message)}`;

    content.innerHTML = `
        <div class="text-center space-y-6">
            <h3 class="text-2xl font-black text-white">
                Pagamento pendente
            </h3>
            <p class="text-gray-300">Envie seus dados no WhatsApp para confirmação da vaga quando o pagamento compensar.</p>
            <div class="bg-black/30 rounded-xl p-6 text-left">
                <p class="text-gray-300"><strong>Time:</strong> ${regData.teamName}</p>
                <p class="text-gray-300"><strong>Email:</strong> ${regData.email}</p>
                <p class="text-gray-300"><strong>WhatsApp:</strong> ${regData.phone}</p>
                <p class="text-gray-300"><strong>Horário:</strong> ${regData.schedule}</p>
            </div>
            <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="block gradient-bg hover:from-orange-600 hover:to-red-600 text-white py-4 px-8 rounded-xl transition-all font-bold uppercase tracking-wider glow-effect">
                Enviar no WhatsApp
            </a>
            <p class="text-sm text-gray-400">Sua vaga será <strong>confirmada pelo WhatsApp</strong> após o pagamento ser identificado.</p>
        </div>
    `;

    modal.classList.remove('hidden');
}

function loadRanking() {
    displayRanking();
}

function displayRanking() {
    const rankingTable = document.getElementById('rankingTable');
    const sortedRanking = [...ranking].sort((a, b) => b.points - a.points);
    
    rankingTable.innerHTML = sortedRanking.map((team, index) => `
        <tr class="${index < 3 ? 'bg-orange-500/10' : 'hover:bg-white/5'} border-b border-gray-700 transition-colors">
            <td class="px-8 py-6">
                <div class="flex items-center text-3xl">
                    ${index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `<span class="text-gray-400 font-bold text-2xl">${index + 1}º</span>`}
                </div>
            </td>
            <td class="px-8 py-6 font-black text-white text-xl">${team.teamName}</td>
            <td class="px-8 py-6 text-orange-400 font-black text-2xl">${team.points}</td>
            <td class="px-8 py-6 text-green-400 font-bold text-xl">${team.victories}</td>
        </tr>
    `).join('');
}

function displayTabelas() {
    const tabelasContent = document.getElementById('tabelasContent');
    const tabelaFilter = document.getElementById('tabelaFilter');
    
    // Update filter options
    const schedules = [...new Set(results.map(r => r.schedule))];
    tabelaFilter.innerHTML = '<option value="">Todos os horários</option>' + 
        schedules.map(schedule => `<option value="${schedule}">${schedule}</option>`).join('');

    // Group results by schedule and map
    const groupedResults = {};
    results.forEach(result => {
        const key = `${result.schedule} - ${result.map}`;
        if (!groupedResults[key]) {
            groupedResults[key] = [];
        }
        groupedResults[key].push(result);
    });

    tabelasContent.innerHTML = Object.entries(groupedResults).map(([key, results]) => {
        const sortedResults = results.sort((a, b) => a.position - b.position);
        return `
            <div class="mb-10 glass-effect rounded-3xl p-8 neon-border">
                <h3 class="font-black text-3xl text-orange-400 mb-8 flex items-center">
                    <i class="fas fa-trophy mr-4"></i>${key}
                </h3>
                <div class="overflow-x-auto">
                    <table class="w-full table-auto">
                        <thead>
                            <tr class="border-b-2 border-gray-600">
                                <th class="px-6 py-4 text-left text-orange-400 font-black uppercase tracking-wider text-lg">Posição</th>
                                <th class="px-6 py-4 text-left text-orange-400 font-black uppercase tracking-wider text-lg">Time</th>
                                <th class="px-6 py-4 text-left text-orange-400 font-black uppercase tracking-wider text-lg">Kills</th>
                                <th class="px-6 py-4 text-left text-orange-400 font-black uppercase tracking-wider text-lg">Pontos</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${sortedResults.map((result, index) => `
                                <tr class="${index < 3 ? 'bg-orange-500/10' : 'hover:bg-white/5'} border-b border-gray-700 transition-colors">
                                    <td class="px-6 py-4 font-black text-white text-xl">
                                        ${index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${result.position}º`}
                                    </td>
                                    <td class="px-6 py-4 text-white font-bold text-lg">${result.teamName}</td>
                                    <td class="px-6 py-4 text-red-400 font-bold text-lg">${result.kills}</td>
                                    <td class="px-6 py-4 text-orange-400 font-black text-xl">${result.points}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }).join('');
}

function filterTabelas() {
    const filter = document.getElementById('tabelaFilter').value;
    // Filter logic would be implemented here
    displayTabelas();
}

// Admin functions
function adminLogin() {
    const password = document.getElementById('adminPassword').value;
    if (password === 'Teste Freitas') { // Nova senha
        isAdminLoggedIn = true;
        document.getElementById('adminLogin').classList.add('hidden');
        document.getElementById('adminPanel').classList.remove('hidden');
        loadAdminData();
        showNotification('Login realizado com sucesso!', 'success');
    } else {
        showNotification('Senha incorreta!', 'error');
    }
}

function loadAdminData() {
    updateAdminStats();
    loadAdminInscricoes();
    populateResultSchedules();
    renderAdminChartsAndInsights();
}

function updateAdminStats() {
    const today = new Date().toDateString();
    const todayRegs = registrations.filter(reg => {
        const regDate = reg.timestamp?.toDate?.() || new Date(reg.timestamp);
        return regDate.toDateString() === today;
    }).length;
    
    const confirmedPayments = registrations.filter(reg => reg.status === 'confirmed').length;
    const monthlyRevenue = (confirmedPayments * 0.50).toFixed(2);

    document.getElementById('todayRegistrations').textContent = todayRegs;
    document.getElementById('confirmedPayments').textContent = confirmedPayments;
    document.getElementById('monthlyRevenue').textContent = `R$ ${monthlyRevenue}`;
}

function renderAdminChartsAndInsights() {
    // Agregar por horário (string schedule: "Dia - 19h")
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);
    const regsLast7 = registrations.filter(reg => {
        const d = reg.timestamp?.toDate?.() || new Date(reg.timestamp || Date.now());
        return d >= last7Days;
    });

    const hourCounts = {};
    regsLast7.forEach(reg => {
        const hour = (reg.schedule || '').split(' - ')[1] || '';
        if (!hour) return;
        if (!hourCounts[hour]) hourCounts[hour] = { total: 0, paid: 0 };
        hourCounts[hour].total += 1;
        if (reg.status === 'confirmed') hourCounts[hour].paid += 1;
    });

    const byHourLabels = Object.keys(hourCounts).sort((a,b) => parseInt(a) - parseInt(b));
    const byHourPaid = byHourLabels.map(h => hourCounts[h].paid);

    const ctx = document.getElementById('chartByHour');
    if (ctx && window.Chart) {
        if (window._chartByHour) {
            window._chartByHour.destroy();
        }
        window._chartByHour = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: byHourLabels,
                datasets: [{
                    label: 'Pagamentos (últimos 7 dias)',
                    data: byHourPaid,
                    backgroundColor: 'rgba(249, 115, 22, 0.6)'
                }]
            },
            options: { responsive: true, plugins: { legend: { display: false } } }
        });
    }

    // Top dias com mais vendas
    const dayCounts = {};
    registrations.forEach(reg => {
        const d = reg.timestamp?.toDate?.() || new Date(reg.timestamp || Date.now());
        const key = d.toLocaleDateString('pt-BR');
        if (!dayCounts[key]) dayCounts[key] = { total: 0, paid: 0 };
        dayCounts[key].total += 1;
        if (reg.status === 'confirmed') dayCounts[key].paid += 1;
    });
    const topDays = Object.entries(dayCounts)
        .sort((a,b) => b[1].paid - a[1].paid)
        .slice(0, 5);
    const topDaysList = document.getElementById('topDaysList');
    if (topDaysList) {
        topDaysList.innerHTML = topDays.map(([day, cnt]) => `<li>${day}: <span class="text-green-400 font-bold">${cnt.paid}</span> pagos</li>`).join('');
    }

    // Conversão
    const totalRegs = registrations.length;
    const paid = registrations.filter(r => r.status === 'confirmed').length;
    const conversion = totalRegs ? ((paid / totalRegs) * 100).toFixed(1) : '0.0';
    const bestHour = byHourLabels.reduce((best, h) => {
        const val = hourCounts[h]?.paid || 0;
        if (!best || val > best.val) return { h, val };
        return best;
    }, null);

    const statTotal = document.getElementById('statTotalRegs');
    const statPaid = document.getElementById('statPaid');
    const statConv = document.getElementById('statConversion');
    const bestHourEl = document.getElementById('bestHour');
    const todayRevenueEl = document.getElementById('todayRevenue');

    if (statTotal) statTotal.textContent = totalRegs;
    if (statPaid) statPaid.textContent = paid;
    if (statConv) statConv.textContent = `${conversion}%`;
    if (bestHourEl) bestHourEl.textContent = bestHour ? `${bestHour.h} ( ${bestHour.val} pagos )` : '-';

    // Receita estimada hoje
    const today = new Date().toDateString();
    const paidToday = registrations.filter(reg => {
        if (reg.status !== 'confirmed') return false;
        const d = reg.timestamp?.toDate?.() || new Date(reg.timestamp || Date.now());
        return d.toDateString() === today;
    }).length;
    const todayRevenue = (paidToday * 0.5).toFixed(2);
    if (todayRevenueEl) todayRevenueEl.textContent = `R$ ${todayRevenue}`;
}

function showAdminTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.admin-tab-btn').forEach(btn => {
        btn.classList.remove('border-orange-500', 'text-orange-400');
        btn.classList.add('border-transparent', 'text-gray-400');
    });
    event.target.classList.remove('border-transparent', 'text-gray-400');
    event.target.classList.add('border-orange-500', 'text-orange-400');

    // Show/hide tab content
    document.querySelectorAll('.admin-tab-content').forEach(content => {
        content.classList.add('hidden');
    });
    document.getElementById('admin' + tabName.charAt(0).toUpperCase() + tabName.slice(1).replace('-', '')).classList.remove('hidden');
}

function loadAdminInscricoes() {
    const table = document.getElementById('adminInscricoesTable');
    table.innerHTML = registrations.map(reg => `
        <tr class="hover:bg-white/5 transition-colors">
            <td class="px-6 py-4 font-bold">${reg.teamName}</td>
            <td class="px-6 py-4">${reg.phone}</td>
            <td class="px-6 py-4">${reg.email}</td>
            <td class="px-6 py-4 font-semibold">${reg.schedule}</td>
            <td class="px-6 py-4">
                <span class="status-badge ${reg.status === 'confirmed' ? 'status-confirmed' : reg.status === 'processing' ? 'status-processing' : 'status-pending'}">
                    ${reg.status === 'confirmed' ? 'Confirmado' : reg.status === 'processing' ? 'Processando' : 'Pendente'}
                </span>
            </td>
            <td class="px-6 py-4">
                <div class="flex space-x-2">
                    ${reg.status !== 'confirmed' ? `
                        <button onclick="confirmPayment('${reg.id}')" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                            <i class="fas fa-check mr-1"></i>Confirmar
                        </button>
                    ` : ''}
                    <button onclick="removeRegistration('${reg.id}')" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                        <i class="fas fa-trash mr-1"></i>Remover
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

async function confirmPayment(registrationId) {
    if (!db) {
        showNotification('Backend não configurado. Configure o Firebase.', 'error');
        return;
    }
    try {
        await db.collection('registrations').doc(registrationId).update({
            status: 'confirmed'
        });
        showNotification('Pagamento confirmado com sucesso!', 'success');
    } catch (error) {
        console.error('Erro ao confirmar pagamento:', error);
        showNotification('Erro ao confirmar pagamento.', 'error');
    }
}

async function removeRegistration(registrationId) {
    if (!db) {
        showNotification('Backend não configurado. Configure o Firebase.', 'error');
        return;
    }
    if (confirm('Tem certeza que deseja remover esta inscrição?')) {
        try {
            await db.collection('registrations').doc(registrationId).delete();
            showNotification('Inscrição removida com sucesso!', 'success');
        } catch (error) {
            console.error('Erro ao remover inscrição:', error);
            showNotification('Erro ao remover inscrição.', 'error');
        }
    }
}

function populateResultSchedules() {
    const schedules = [...new Set(registrations.filter(reg => reg.status === 'confirmed').map(reg => reg.schedule))];
    const select = document.getElementById('resultSchedule');
    select.innerHTML = '<option value="">Selecionar Horário</option>' + 
        schedules.map(schedule => `<option value="${schedule}">${schedule}</option>`).join('');
}

async function launchResult(event) {
    event.preventDefault();
    if (!db) {
        showNotification('Backend não configurado. Configure o Firebase.', 'error');
        return;
    }
    
    const schedule = document.getElementById('resultSchedule').value;
    const map = document.getElementById('resultMap').value;
    const teamName = document.getElementById('resultTeam').value;
    const position = parseInt(document.getElementById('resultPosition').value);
    const kills = parseInt(document.getElementById('resultKills').value);

    // Calculate points
    const positionPoints = position === 1 ? 10 : position === 2 ? 6 : position === 3 ? 4 : position === 4 ? 2 : position === 5 ? 1 : 0;
    const totalPoints = positionPoints + kills;

    try {
        await db.collection('results').add({
            schedule,
            map,
            teamName,
            position,
            kills,
            points: totalPoints,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });

        // Update ranking
        const existingTeam = ranking.find(team => team.teamName === teamName);
        if (existingTeam) {
            await db.collection('ranking').doc(existingTeam.id).update({
                points: existingTeam.points + totalPoints,
                victories: position === 1 ? existingTeam.victories + 1 : existingTeam.victories
            });
        } else {
            await db.collection('ranking').add({
                teamName,
                points: totalPoints,
                victories: position === 1 ? 1 : 0
            });
        }

        // Clear form
        document.getElementById('resultTeam').value = '';
        document.getElementById('resultPosition').value = '';
        document.getElementById('resultKills').value = '';
        
        showNotification('Resultado lançado com sucesso!', 'success');
    } catch (error) {
        console.error('Erro ao lançar resultado:', error);
        showNotification('Erro ao lançar resultado.', 'error');
    }
}

async function updateRanking(event) {
    event.preventDefault();
    if (!db) {
        showNotification('Backend não configurado. Configure o Firebase.', 'error');
        return;
    }
    
    const teamName = document.getElementById('rankingTeam').value;
    const points = parseInt(document.getElementById('rankingPoints').value);

    try {
        const existingTeam = ranking.find(team => team.teamName === teamName);
        if (existingTeam) {
            await db.collection('ranking').doc(existingTeam.id).update({
                points: points
            });
        } else {
            await db.collection('ranking').add({
                teamName,
                points,
                victories: 0
            });
        }

        document.getElementById('rankingTeam').value = '';
        document.getElementById('rankingPoints').value = '';
        
        showNotification('Ranking atualizado com sucesso!', 'success');
    } catch (error) {
        console.error('Erro ao atualizar ranking:', error);
        showNotification('Erro ao atualizar ranking.', 'error');
    }
}

// Logs de configuração do webhook do Mercado Pago removidos para produção
