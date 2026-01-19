'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.foldersAndFiles = foldersAndFiles;
// nS - No Space
// lC - Lowercase

function foldersAndFiles(currentAppName, newName) {
  var nS_CurrentAppName = currentAppName.replace(/\s/g, '');
  var nS_NewName = newName.replace(/\s/g, '');

  return ['ios/' + nS_CurrentAppName, 'ios/' + nS_CurrentAppName + '-tvOS', 'ios/' + nS_CurrentAppName + '-tvOSTests', 'ios/' + nS_CurrentAppName + '.xcodeproj', 'ios/' + nS_NewName + '.xcodeproj/xcshareddata/xcschemes/' + nS_CurrentAppName + '-tvOS.xcscheme', 'ios/' + nS_NewName + '.xcodeproj/xcshareddata/xcschemes/' + nS_CurrentAppName + '.xcscheme', 'ios/' + nS_CurrentAppName + 'Tests', 'ios/' + nS_NewName + 'Tests/' + nS_CurrentAppName + 'Tests.m', 'ios/' + nS_CurrentAppName + '.xcworkspace', 'ios/' + nS_NewName + '/' + nS_CurrentAppName + '.entitlements', 'ios/' + nS_CurrentAppName + '-Bridging-Header.h'];
}