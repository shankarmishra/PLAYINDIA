package com.playindia

import android.app.Application
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.facebook.react.defaults.DefaultReactNativeHost
import com.facebook.soloader.SoLoader

import androidx.multidex.MultiDexApplication

// Import native modules
import com.th3rdwave.safeareacontext.SafeAreaContextPackage
import com.oblador.vectoricons.VectorIconsPackage
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage
import com.swmansion.rnscreens.RNScreensPackage
import com.rnmaps.maps.MapsPackage
import com.agontuk.RNFusedLocation.RNFusedLocationPackage

// Minimal application with only core packages
class MainApplication : MultiDexApplication(), ReactApplication {

  override val reactNativeHost: ReactNativeHost =
      object : DefaultReactNativeHost(this) {
        override fun getPackages(): List<ReactPackage> = listOf(
          com.facebook.react.shell.MainReactPackage(),
          SafeAreaContextPackage(),
          VectorIconsPackage(),
          AsyncStoragePackage(),
          RNScreensPackage(),
          MapsPackage(),
          RNFusedLocationPackage()
        )

        override fun getJSMainModuleName(): String = "index"

        override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

        override val isNewArchEnabled: Boolean = false
        override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED
      }

  override val reactHost: ReactHost
    get() = getDefaultReactHost(applicationContext, reactNativeHost)

  override fun attachBaseContext(base: android.content.Context) {
    super.attachBaseContext(base)
    androidx.multidex.MultiDex.install(this)
  }

  override fun onCreate() {
    super.onCreate()
    SoLoader.init(this, /* native exopackage */ false)
    // Initialize vector icons
    com.oblador.vectoricons.VectorIconsPackage()
  }
}
