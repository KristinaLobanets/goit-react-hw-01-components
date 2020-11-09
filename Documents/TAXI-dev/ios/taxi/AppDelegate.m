/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"

#import <Firebase.h>
// #import "RNFirebaseNotifications.h"
//#import "RNFirebaseMessaging.h"
#import <UserNotifications/UserNotifications.h>
#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <GoogleMaps/GoogleMaps.h>
#import <FBSDKCoreKit/FBSDKCoreKit.h>

#define SYSTEM_VERSION_GREATER_THAN_OR_EQUAL_TO(v)  ([[[UIDevice currentDevice] systemVersion] compare:v options:NSNumericSearch] != NSOrderedAscending)  
#define SYSTEM_VERSION_LESS_THAN(v) ([[[UIDevice currentDevice] systemVersion] compare:v options:NSNumericSearch] == NSOrderedAscending)

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
 [GMSServices provideAPIKey:@"AIzaSyDWogqTJuVHBpd1QLtztaTk5BI1QGvQwJs"];
  [FIRApp configure];
  // [RNFirebaseNotifications configure];
  [[FBSDKApplicationDelegate sharedInstance] application:application
                           didFinishLaunchingWithOptions:launchOptions];

  application.applicationIconBadgeNumber = 0;

 if( SYSTEM_VERSION_LESS_THAN( @"10.0" ) ) {  
   [[UIApplication sharedApplication] registerUserNotificationSettings:[UIUserNotificationSettings settingsForTypes:(UIUserNotificationTypeSound |    UIUserNotificationTypeAlert | UIUserNotificationTypeBadge |  UNAuthorizationOptionProvidesAppNotificationSettings) categories:nil]];  
       [[UIApplication sharedApplication] registerForRemoteNotifications];  

   } else {  
     UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];  
     center.delegate = self;  
     [center requestAuthorizationWithOptions:(UNAuthorizationOptionSound | UNAuthorizationOptionAlert | UNAuthorizationOptionBadge) completionHandler:^(BOOL granted, NSError * _Nullable error) {
       if( !error ) {
           // required to get the app to do anything at all about push notifications  
           [[UIApplication sharedApplication] registerForRemoteNotifications];
           NSLog( @"Push registration success." );  
       } else {
           NSLog( @"Push registration FAILED" );  
           NSLog( @"ERROR: %@ - %@", error.localizedFailureReason, error.localizedDescription );  
           NSLog( @"SUGGESTIONS: %@ - %@", error.localizedRecoveryOptions, error.localizedRecoverySuggestion );  
       }
       }];
   }

  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"oktaxi"
                                            initialProperties:nil];

  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  return YES;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

- (void)application:(UIApplication*)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken  
{  
// custom stuff we do to register the device with our AWS middleman  
}

 - (void)application:(UIApplication*)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:(void  
  (^)(UIBackgroundFetchResult))completionHandler  
  {  
// iOS 10 will handle notifications through other methods  

  if( SYSTEM_VERSION_GREATER_THAN_OR_EQUAL_TO( @"10.0" ) )  
  {  
    NSLog( @"iOS version >= 10. Let NotificationCenter handle this one." );  
  // set a member variable to tell the new delegate that this is background  
    return;  
  }  
  NSLog( @"HANDLE PUSH, didReceiveRemoteNotification: %@", userInfo );  

  // custom code to handle notification content  

  if( [UIApplication sharedApplication].applicationState == UIApplicationStateInactive )  
  {  
    NSLog( @"INACTIVE" );  
    completionHandler( UIBackgroundFetchResultNewData );  
  }  
  else if( [UIApplication sharedApplication].applicationState == UIApplicationStateBackground )  
  {  
    NSLog( @"BACKGROUND" );  
    completionHandler( UIBackgroundFetchResultNewData );  
  }  
  else  
  {  
    NSLog( @"FOREGROUND" );  
    completionHandler( UIBackgroundFetchResultNewData );  
  }  
}  

- (void)userNotificationCenter:(UNUserNotificationCenter *)center  
    willPresentNotification:(UNNotification *)notification  
  withCompletionHandler:(void (^)(UNNotificationPresentationOptions options))completionHandler  
    {  
  NSLog( @"Handle push from foreground" );  
  // custom code to handle push while app is in the foreground  
    NSLog(@"%@", notification.request.content.userInfo);
   }  

- (void)userNotificationCenter:(UNUserNotificationCenter *)center
didReceiveNotificationResponse:(UNNotificationResponse *)response
 withCompletionHandler:(void (^)())completionHandler
  {
    NSLog( @"Handle push from background or closed" );
    // if you set a member variable in didReceiveRemoteNotification, you  will know if this is from closed or background
    NSLog(@"%@", response.notification.request.content.userInfo);
   }

   - (void)userNotificationCenter:(UNUserNotificationCenter *)center
  openSettingsForNotification:(UNNotification *)notification{
       // Open notification settings screen in app
  }


@end
