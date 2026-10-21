import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:netscope_client/main.dart';

void main() {
  testWidgets(
    'foundation exposes unknown usage and never fake live collection',
    (tester) async {
      await tester.pumpWidget(const NetScopeApp());
      expect(find.text('لا توجد قياسات بعد'), findsOneWidget);
      expect(find.text('لم يبدأ القياس'), findsOneWidget);
      expect(find.text('0 GB'), findsNothing);
      expect(
        Directionality.of(tester.element(find.text('لا توجد قياسات بعد'))),
        TextDirection.rtl,
      );

      await tester.tap(find.text('English'));
      await tester.pumpAndSettle();
      expect(find.text('No usage measured yet'), findsOneWidget);
      expect(
        Directionality.of(tester.element(find.text('No usage measured yet'))),
        TextDirection.ltr,
      );

      await tester.tap(find.byTooltip('Change theme'));
      await tester.pumpAndSettle();
      expect(
        Theme.of(tester.element(find.text('No usage measured yet'))).brightness,
        Brightness.dark,
      );
    },
  );

  testWidgets(
    'compact large-text layout preserves content and device navigation',
    (tester) async {
      tester.view.physicalSize = const Size(320, 800);
      tester.view.devicePixelRatio = 1;
      tester.platformDispatcher.textScaleFactorTestValue = 2;
      addTearDown(tester.view.resetPhysicalSize);
      addTearDown(tester.view.resetDevicePixelRatio);
      addTearDown(tester.platformDispatcher.clearTextScaleFactorTestValue);

      await tester.pumpWidget(const NetScopeApp());
      expect(tester.takeException(), isNull);
      await tester.tap(find.text('الأجهزة'));
      await tester.pumpAndSettle();
      expect(find.text('لا توجد بيانات أجهزة بعد'), findsOneWidget);
      expect(tester.takeException(), isNull);
    },
  );
}
