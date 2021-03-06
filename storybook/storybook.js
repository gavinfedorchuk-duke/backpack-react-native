/*
 * Backpack - Skyscanner's Design System
 *
 * Copyright 2016-2020 Skyscanner Ltd
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* @flow */
import React, { type Node } from 'react';
import addon from '@storybook/addons';
import { I18nManager, YellowBox, View } from 'react-native';
import { getStorybookUI, configure } from '@storybook/react-native';
import { backgroundColor } from 'bpk-tokens/tokens/base.react.native';

import BpkAppearance, {
  BpkAppearanceProvider,
  useBpkDynamicValue,
} from '../packages/react-native-bpk-appearance';

import {
  RTL_EVENT,
  CHANNEL_POLL_INTERVAL,
  RTL_INIT,
  DM_EVENT,
  DM_INIT,
} from './constants';

const onChannelAvailable = (...fns) => {
  const interval = setInterval(() => {
    try {
      const channel = addon.getChannel();
      clearInterval(interval);
      // $FlowFixMe
      fns.map(fn => fn(channel));
      return true;
    } catch (exe) {
      return false;
    }
  }, CHANNEL_POLL_INTERVAL);
};

const initRtlAddon = channel => {
  channel.emit(RTL_INIT, I18nManager.isRTL);
  channel.on(RTL_EVENT, rtlEnabled => I18nManager.forceRTL(rtlEnabled));
};

const initDarkModeAddon = channel => {
  channel.emit(DM_INIT, BpkAppearance.get().colorScheme || 'light');
  channel.on(DM_EVENT, colorScheme => BpkAppearance.set({ colorScheme }));
};

const hideWarnings = () => {
  // TODO: this warning is being trigger by an internal react code, we can remove it when it gets fixed
  // see: https://github.com/facebook/react-native/issues/18868#issuecomment-382671739
  YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated']);
};

/* eslint-disable global-require */
configure(() => {
  require('../packages/react-native-bpk-component-alert/stories');
  require('../packages/react-native-bpk-component-animate-height/stories');
  require('../packages/react-native-bpk-component-badge/stories');
  require('../packages/react-native-bpk-component-banner-alert/stories');
  require('../packages/react-native-bpk-component-button-link/stories');
  require('../packages/react-native-bpk-component-button/stories');
  require('../packages/react-native-bpk-component-calendar/stories');
  require('../packages/react-native-bpk-component-card/stories');
  require('../packages/react-native-bpk-component-carousel-indicator/stories');
  require('../packages/react-native-bpk-component-carousel/stories');
  require('../packages/react-native-bpk-component-chip/stories');
  require('../packages/react-native-bpk-component-dialog/stories');
  require('../packages/react-native-bpk-component-flat-list/stories');
  require('../packages/react-native-bpk-component-horizontal-nav/stories');
  require('../packages/react-native-bpk-component-icon/stories');
  require('../packages/react-native-bpk-component-image/stories');
  require('../packages/react-native-bpk-component-map/stories');
  require('../packages/react-native-bpk-component-navigation-bar/stories');
  require('../packages/react-native-bpk-component-nudger/stories');
  require('../packages/react-native-bpk-component-panel/stories');
  require('../packages/react-native-bpk-component-phone-input/stories');
  require('../packages/react-native-bpk-component-picker/stories');
  require('../packages/react-native-bpk-component-progress/stories');
  require('../packages/react-native-bpk-component-rating/stories');
  require('../packages/react-native-bpk-component-section-list/stories');
  require('../packages/react-native-bpk-component-select/stories');
  require('../packages/react-native-bpk-component-spinner/stories');
  require('../packages/react-native-bpk-component-star-rating/stories');
  require('../packages/react-native-bpk-component-switch/stories');
  require('../packages/react-native-bpk-component-text-input/stories');
  require('../packages/react-native-bpk-component-text/stories');
  require('../packages/react-native-bpk-component-touchable-native-feedback/stories');
  require('../packages/react-native-bpk-component-touchable-overlay/stories');
  require('../packages/react-native-bpk-appearance/stories');
  require('../packages/react-native-bpk-styles/stories');
  require('../packages/react-native-bpk-theming/stories');
}, module);
/* eslint-enable global-require */

const StorybookUI = getStorybookUI({ onDeviceUI: false });

onChannelAvailable(hideWarnings, initRtlAddon, initDarkModeAddon);

const BackgroundWrapper = ({ children }: { children: Node }) => (
  <View
    style={{
      backgroundColor: useBpkDynamicValue(backgroundColor),
      flex: 1,
    }}
  >
    {children}
  </View>
);

export default (props: Object) => (
  <BpkAppearanceProvider>
    <BackgroundWrapper>
      <StorybookUI {...props} />
    </BackgroundWrapper>
  </BpkAppearanceProvider>
);
