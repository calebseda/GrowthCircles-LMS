/**
 * Growth Circles Bridge (gc_bridge.js)
 * Purpose: Manages cross-domain communication and API bridging 
 * for growthcircles4rher.africa
 */

(function(window) {
    'use strict';

    const GC_CONFIG = {
        origin: 'https://growthcircles4rher.africa',
        apiEndpoint: 'https://api.growthcircles.africa', // Standard API target
        version: '1.0.4'
    };

    const GCBridge = {
        init: function() {
            console.log("Growth Circles Bridge initialized for: " + GC_CONFIG.origin);
            this.setupListeners();
        },

        // Handles secure message passing between the main site and any embedded frames
        setupListeners: function() {
            window.addEventListener('message', (event) => {
                if (event.origin !== GC_CONFIG.origin) return;
                
                if (event.data && event.data.type === 'GC_ACTION') {
                    this.handleAction(event.data.payload);
                }
            }, false);
        },

        // Dispatches data to the Growth Circles backend
        handleAction: async function(payload) {
            try {
                const response = await fetch(`${GC_CONFIG.apiEndpoint}/bridge`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                return await response.json();
            } catch (error) {
                console.error("GC Bridge Error:", error);
            }
        }
    };

    // Auto-initialize on load
    window.GCBridge = GCBridge;
    GCBridge.init();

})(window);
