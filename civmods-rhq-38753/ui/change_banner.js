// === FULL MONKEY PATCH FOR City Banners (buildBanner/CSS Visibility + Turn-Based Update Fix for Player 1000) ===
// Place this code in your mod so it runs AFTER the original game scripts for
// '/base-standard/ui/city-banners/city-banners.js' AND
// '/base-standard/ui/city-banners/city-banner-manager.js' have loaded.
// REMOVE ALL PREVIOUS PATCHES related to city banners first.

// Ensure necessary imports are available in your mod's context
import { CityBannerComponent } from '/base-standard/ui/city-banners/city-banners.js';
import CityBannerManager from '/base-standard/ui/city-banners/city-banner-manager.js';
import { ComponentID } from '/core/ui/utilities/utilities-component-id.js';

console.log("[Banner Fix JS v3] Applying patches for observer 1000...");

try {
    // --- PART 1: Visibility Fix using buildBanner Patch + CSS ---
    // This adds the 'observer-view-active' class without modifying setCityInfo.
    // CSS rules (see Step 2 below) will use this class to ensure visibility.
    const originalBuildBanner = CityBannerComponent.prototype.buildBanner;
    if (originalBuildBanner && !CityBannerComponent.prototype.hasOwnProperty('_ObserverFix1000_BuildBannerPatch')) {
        CityBannerComponent.prototype.buildBanner = function() {
            // Call original first to set up everything, including base classes
            originalBuildBanner.apply(this, arguments);

            // Add observer class based on ID 1000 AFTER original logic runs
            // This allows original setCityInfo to correctly set --city vs --city-other
            const isObserverView1000 = (GameContext.localObserverID === 1000);
            if (this.Root) { // Check if Root is valid
                 this.Root.classList.toggle('observer-view-active', isObserverView1000);
            }
        };
        CityBannerComponent.prototype._ObserverFix1000_BuildBannerPatch = true; // Flag
        console.log("[Banner Fix JS v3] Patched buildBanner for observer class (ID 1000).");
    } else if (!originalBuildBanner) {
        console.error("[Banner Fix JS v3] Could not find original CityBannerComponent.buildBanner to patch!");
    } else {
        console.log("[Banner Fix JS v3] buildBanner patch already applied.");
    }

    // --- PART 2: Update Fix using PlayerTurnActivated in Manager ---
    // This attempts to update banners when AI turns start in observer mode.

    // Add the new event handler method to the Manager's prototype
    if (CityBannerManager && !CityBannerManager.prototype.hasOwnProperty('onPlayerTurnActivated_ObserverFix1000')) {
        CityBannerManager.prototype.onPlayerTurnActivated_ObserverFix1000 = function(data) {
            if (GameContext.localObserverID === 1000) { // <-- Check for 1000
                const activatedPlayerID = data.player;
                if (activatedPlayerID !== GameContext.localObserverID && activatedPlayerID !== PlayerIds.NO_PLAYER) {
                    const logPrefix = `[Manager Patch v3 - OBS 1000] PlayerTurnActivated for AI ${activatedPlayerID}:`;
                    // console.log(`${logPrefix} Triggering banner updates.`); // Keep for debug if needed
                    if (!this.banners || !(this.banners instanceof Map)) {
                         console.error(`${logPrefix} this.banners not found or not a Map!`); return;
                    }
                    this.banners.forEach((banner, bannerKey) => {
                        if (banner && banner.componentID && banner.componentID.owner === activatedPlayerID) {
                             // console.log(`${logPrefix}   - Updating banner for ${ComponentID.toLogString(banner.componentID)}`); // Keep for debug if needed
                             if (typeof banner.queueBuildsUpdate === 'function') {
                                 banner.queueBuildsUpdate();
                             } else {
                                 console.error(`${logPrefix} Banner missing queueBuildsUpdate method!`);
                             }
                        }
                    });
                }
            }
            // Call original if needed (assume not for now)
        };
        console.log("[Banner Fix JS v3] Added onPlayerTurnActivated_ObserverFix1000 method to CityBannerManager.");
    }

    // Patch onAttach to add the listener
    const originalManagerOnAttach = CityBannerManager.prototype.onAttach;
    if (originalManagerOnAttach && !CityBannerManager.prototype.hasOwnProperty('_ObserverFix1000_TurnUpdate_AttachPatch')) {
        CityBannerManager.prototype.onAttach = function() {
            if (!this.onPlayerTurnActivatedListener_ObserverFix1000) {
                 if(typeof this.onPlayerTurnActivated_ObserverFix1000 === 'function'){
                    this.onPlayerTurnActivatedListener_ObserverFix1000 = this.onPlayerTurnActivated_ObserverFix1000.bind(this);
                 } else {
                     console.error("[Banner Fix JS v3] Handler method onPlayerTurnActivated_ObserverFix1000 missing on prototype before binding!");
                 }
            }
            originalManagerOnAttach.apply(this, arguments); // Call original first
            if (this.onPlayerTurnActivatedListener_ObserverFix1000) {
                engine.off('PlayerTurnActivated', this.onPlayerTurnActivatedListener_ObserverFix1000);
                engine.on('PlayerTurnActivated', this.onPlayerTurnActivatedListener_ObserverFix1000);
            }
        };
        CityBannerManager.prototype._ObserverFix1000_TurnUpdate_AttachPatch = true; // Flag
        console.log("[Banner Fix JS v3] Patched CityBannerManager onAttach to add listener.");
    } else if (!originalManagerOnAttach) {
         console.error("[Banner Fix JS v3] Could not find original CityBannerManager.onAttach to patch!");
    } else {
         console.log("[Banner Fix JS v3] CityBannerManager onAttach patch already applied.");
    }

    // Patch onDetach to remove the listener
    const originalManagerOnDetach = CityBannerManager.prototype.onDetach;
    if (originalManagerOnDetach && !CityBannerManager.prototype.hasOwnProperty('_ObserverFix1000_TurnUpdate_DetachPatch')) {
        CityBannerManager.prototype.onDetach = function() {
             if (this.onPlayerTurnActivatedListener_ObserverFix1000) { // Check if listener exists before removing
                  engine.off('PlayerTurnActivated', this.onPlayerTurnActivatedListener_ObserverFix1000);
             }
            originalManagerOnDetach.apply(this, arguments); // Call original last
        };
        CityBannerManager.prototype._ObserverFix1000_TurnUpdate_DetachPatch = true; // Flag
        console.log("[Banner Fix JS v3] Patched CityBannerManager onDetach to remove listener.");
    } else if (!originalManagerOnDetach) {
         console.error("[Banner Fix JS v3] Could not find original CityBannerManager.onDetach to patch!");
    } else {
         console.log("[Banner Fix JS v3] CityBannerManager onDetach patch already applied.");
    }

    console.log("[Banner Fix JS v3] All patches applied successfully (ID 1000).");

} catch (error) {
    console.error("[Banner Fix JS v3] Error applying patches:", error);
}

// === END FULL MONKEY PATCH ===