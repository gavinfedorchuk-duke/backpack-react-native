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
import React, {
  createContext,
  useState,
  useEffect,
  type Context,
  type Node,
} from 'react';
import { AppearanceProvider, Appearance } from 'react-native-appearance';

import BpkAppearance, { type BpkAppearancePreferences } from './BpkAppearance';

export const BpkAppearanceProviderContext: Context<BpkAppearancePreferences> = createContext(
  BpkAppearance.get(),
);
BpkAppearanceProviderContext.displayName = 'BpkAppearanceProviderContext';

export type Props = {
  children: Node,
  appearanceOverride: $Shape<BpkAppearancePreferences>,
};

const BpkAppearanceProvider = ({ children, appearanceOverride }: Props) => {
  const [currentAppearance, setCurrentAppearance] = useState(
    BpkAppearance.get(),
  );

  useEffect(() => {
    // This is needed if the initial color scheme is different to the the current color scheme.
    // This can happen on iOS if a user switches interface style after launch, but before entering an RN screen.
    setCurrentAppearance(Appearance.getColorScheme());

    function handler(newAppearance: BpkAppearancePreferences) {
      setCurrentAppearance(newAppearance);
    }

    BpkAppearance.addChangeListener(handler);
    return () => {
      BpkAppearance.removeChangeListener(handler);
    };
  }, []);

  return (
    <BpkAppearanceProviderContext.Provider
      value={{ ...currentAppearance, ...appearanceOverride }}
    >
      <AppearanceProvider>{children}</AppearanceProvider>
    </BpkAppearanceProviderContext.Provider>
  );
};

BpkAppearanceProvider.defaultProps = {
  appearanceOverride: {},
};

export default BpkAppearanceProvider;
