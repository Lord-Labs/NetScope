import 'package:flutter/material.dart';

import 'tokens.g.dart';

ThemeData buildNetScopeTheme(Brightness brightness) {
  final dark = brightness == Brightness.dark;
  final foreground = dark
      ? NetScopeTokens.darkForeground
      : NetScopeTokens.lightForeground;
  final surface = dark
      ? NetScopeTokens.darkSurface
      : NetScopeTokens.lightSurface;
  final accent = dark ? NetScopeTokens.darkAccent : NetScopeTokens.lightAccent;
  final accentForeground = dark
      ? NetScopeTokens.darkAccentForeground
      : NetScopeTokens.lightAccentForeground;
  final scheme = ColorScheme.fromSeed(seedColor: accent, brightness: brightness)
      .copyWith(
        primary: accent,
        onPrimary: accentForeground,
        surface: surface,
        onSurface: foreground,
        error: dark ? NetScopeTokens.darkDanger : NetScopeTokens.lightDanger,
        outline: dark
            ? NetScopeTokens.darkBorderStrong
            : NetScopeTokens.lightBorderStrong,
      );
  final base = ThemeData(useMaterial3: true, colorScheme: scheme);
  return base.copyWith(
    scaffoldBackgroundColor: dark
        ? NetScopeTokens.darkBackground
        : NetScopeTokens.lightBackground,
    appBarTheme: AppBarTheme(
      backgroundColor: dark
          ? NetScopeTokens.darkBackground
          : NetScopeTokens.lightBackground,
      foregroundColor: foreground,
      elevation: 0,
      scrolledUnderElevation: 0,
    ),
    textTheme: base.textTheme
        .copyWith(
          headlineMedium: TextStyle(
            fontSize: NetScopeTokens.typeTitle,
            fontWeight: FontWeight.w500,
            height: 1.4,
            color: foreground,
          ),
          titleLarge: TextStyle(
            fontSize: NetScopeTokens.typeSection,
            fontWeight: FontWeight.w500,
            height: 1.4,
            color: foreground,
          ),
          bodyLarge: TextStyle(
            fontSize: NetScopeTokens.typeBody,
            fontWeight: FontWeight.w400,
            height: 1.6,
            color: foreground,
          ),
          bodyMedium: TextStyle(
            fontSize: NetScopeTokens.typeLabel,
            fontWeight: FontWeight.w400,
            height: 1.6,
            color: dark
                ? NetScopeTokens.darkTextSecondary
                : NetScopeTokens.lightTextSecondary,
          ),
        )
        .apply(fontFamily: base.textTheme.bodyMedium?.fontFamily),
    filledButtonTheme: FilledButtonThemeData(
      style: FilledButton.styleFrom(
        minimumSize: const Size(48, 48),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(NetScopeTokens.radiusControl),
        ),
      ),
    ),
  );
}
