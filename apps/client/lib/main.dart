import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';

import 'design/theme.dart';
import 'design/tokens.g.dart';

void main() => runApp(const NetScopeApp());

class NetScopeApp extends StatefulWidget {
  const NetScopeApp({super.key});

  @override
  State<NetScopeApp> createState() => _NetScopeAppState();
}

class _NetScopeAppState extends State<NetScopeApp> {
  bool _arabic = true;
  ThemeMode _themeMode = ThemeMode.system;
  int _destination = 0;

  String copy(String arabic, String english) => _arabic ? arabic : english;

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'NetScope',
      debugShowCheckedModeBanner: false,
      locale: Locale(_arabic ? 'ar' : 'en'),
      supportedLocales: const [Locale('ar'), Locale('en')],
      localizationsDelegates: GlobalMaterialLocalizations.delegates,
      theme: buildNetScopeTheme(Brightness.light),
      darkTheme: buildNetScopeTheme(Brightness.dark),
      themeMode: _themeMode,
      themeAnimationDuration: Duration.zero,
      home: Builder(
        builder: (context) {
          final compact =
              MediaQuery.sizeOf(context).width <
              NetScopeTokens.layoutCompactBreakpoint;
          final destinations = [
            copy('نظرة عامة', 'Overview'),
            copy('الأجهزة', 'Devices'),
          ];
          return Scaffold(
            appBar: AppBar(
              title: Text(
                'NetScope',
                style: Theme.of(context).textTheme.titleLarge,
              ),
              actions: [
                TextButton(
                  onPressed: () => setState(() => _arabic = !_arabic),
                  child: Text(_arabic ? 'English' : 'العربية'),
                ),
                IconButton(
                  tooltip: copy('تغيير المظهر', 'Change theme'),
                  onPressed: () => setState(() {
                    _themeMode = Theme.of(context).brightness == Brightness.dark
                        ? ThemeMode.light
                        : ThemeMode.dark;
                  }),
                  icon: const Icon(Icons.contrast_outlined),
                ),
                const SizedBox(width: NetScopeTokens.spacingSm),
              ],
            ),
            bottomNavigationBar: compact
                ? NavigationBar(
                    selectedIndex: _destination,
                    onDestinationSelected: (value) =>
                        setState(() => _destination = value),
                    destinations: [
                      NavigationDestination(
                        icon: const Icon(Icons.space_dashboard_outlined),
                        label: destinations[0],
                      ),
                      NavigationDestination(
                        icon: const Icon(Icons.devices_outlined),
                        label: destinations[1],
                      ),
                    ],
                  )
                : null,
            body: SafeArea(
              child: Row(
                children: [
                  if (!compact)
                    NavigationRail(
                      selectedIndex: _destination,
                      labelType: NavigationRailLabelType.all,
                      onDestinationSelected: (value) =>
                          setState(() => _destination = value),
                      destinations: [
                        NavigationRailDestination(
                          icon: const Icon(Icons.space_dashboard_outlined),
                          label: Text(destinations[0]),
                        ),
                        NavigationRailDestination(
                          icon: const Icon(Icons.devices_outlined),
                          label: Text(destinations[1]),
                        ),
                      ],
                    ),
                  Expanded(
                    child: Align(
                      alignment: Alignment.topCenter,
                      child: ConstrainedBox(
                        constraints: const BoxConstraints(
                          maxWidth: NetScopeTokens.layoutContentMax,
                        ),
                        child: ListView(
                          padding: EdgeInsets.all(
                            compact
                                ? NetScopeTokens.spacingLg
                                : NetScopeTokens.spacingXxl,
                          ),
                          children: _destination == 0
                              ? _overview(context)
                              : _devices(context),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  List<Widget> _overview(BuildContext context) => [
    Text(
      copy('استهلاكك، بوضوح', 'Your usage, clearly'),
      style: Theme.of(context).textTheme.headlineMedium,
    ),
    const SizedBox(height: NetScopeTokens.spacingSm),
    Text(
      copy(
        'اعرف ما قيس، وما لم يُقَس بعد.',
        'Know what was measured and what is still unknown.',
      ),
    ),
    const SizedBox(height: NetScopeTokens.spacingXxl),
    _surface(
      context,
      Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(copy('الاستهلاك المسجل', 'Recorded usage')),
          const SizedBox(height: NetScopeTokens.spacingSm),
          Semantics(
            label: copy('الاستهلاك غير معروف', 'Usage is unknown'),
            child: ExcludeSemantics(
              child: Text(
                '—',
                style: TextStyle(
                  fontSize: NetScopeTokens.typeMetric,
                  fontWeight: FontWeight.w500,
                  fontFeatures: const [FontFeature.tabularFigures()],
                  color: Theme.of(context).colorScheme.onSurface,
                ),
              ),
            ),
          ),
          const SizedBox(height: NetScopeTokens.spacingSm),
          Text(copy('لا توجد قياسات بعد', 'No usage measured yet')),
          const SizedBox(height: NetScopeTokens.spacingXl),
          const Divider(height: 1),
          const SizedBox(height: NetScopeTokens.spacingXl),
          Wrap(
            spacing: NetScopeTokens.spacingSm,
            crossAxisAlignment: WrapCrossAlignment.center,
            children: [
              const ExcludeSemantics(
                child: Icon(Icons.pause_circle_outline, size: 20),
              ),
              Text(copy('لم يبدأ القياس', 'Not measuring')),
            ],
          ),
          const SizedBox(height: NetScopeTokens.spacingSm),
          Text(
            copy(
              'هذه واجهة أولية. لم يُفعّل قياس الاستخدام على هذا الجهاز بعد.',
              'This is a foundation build. Usage collection is not enabled on this device yet.',
            ),
            style: Theme.of(context).textTheme.bodyMedium,
          ),
        ],
      ),
    ),
    const SizedBox(height: NetScopeTokens.spacingXl),
    Text(
      copy('الفترات المفقودة ليست صفرًا', 'Missing periods are not zero'),
      style: Theme.of(context).textTheme.titleLarge,
    ),
    const SizedBox(height: NetScopeTokens.spacingSm),
    Text(
      copy(
        'ستظهر حالة القياس والفجوات بجانب أرقام الاستخدام. لا توجد بيانات تجريبية محسوبة على حسابك.',
        'Collection status and gaps belong beside usage totals. No sample consumption is counted as your usage.',
      ),
      style: Theme.of(context).textTheme.bodyMedium,
    ),
    const SizedBox(height: NetScopeTokens.spacingXl),
    Align(
      alignment: AlignmentDirectional.centerStart,
      child: FilledButton(
        onPressed: () => showDialog<void>(
          context: context,
          builder: (dialogContext) => AlertDialog(
            title: Text(copy('كيف يعمل NetScope', 'How NetScope works')),
            content: Text(
              copy(
                'تختار شبكة السكن مرة واحدة. يُحفظ الاستخدام محليًا وتظهر الفجوات بوضوح. هذه النسخة تجهز الواجهة فقط، ولم يبدأ القياس الفعلي بعد.',
                'Select the household network once. Usage is stored locally and missing coverage stays visible. This build prepares the interface only; real collection has not started.',
              ),
            ),
            actions: [
              TextButton(
                onPressed: () => Navigator.of(dialogContext).pop(),
                child: Text(copy('إغلاق', 'Close')),
              ),
            ],
          ),
        ),
        child: Text(copy('طريقة العمل', 'How it works')),
      ),
    ),
  ];

  List<Widget> _devices(BuildContext context) => [
    Text(
      copy('أجهزتك', 'Your devices'),
      style: Theme.of(context).textTheme.headlineMedium,
    ),
    const SizedBox(height: NetScopeTokens.spacingSm),
    Text(
      copy('تفاصيل أجهزتك تخصك وحدك.', 'Your device details belong to you.'),
    ),
    const SizedBox(height: NetScopeTokens.spacingXxl),
    _surface(
      context,
      Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(copy('لا توجد بيانات أجهزة بعد', 'No device data yet')),
          const SizedBox(height: NetScopeTokens.spacingSm),
          Text(
            copy(
              'ستظهر الأجهزة بعد تفعيل القياس والربط. لم تُسجل أجهزة أو اتصالات وهمية في هذه النسخة.',
              'Devices appear after measurement and registration are implemented. This build does not invent registered devices or connections.',
            ),
            style: Theme.of(context).textTheme.bodyMedium,
          ),
        ],
      ),
    ),
  ];

  Widget _surface(BuildContext context, Widget child) {
    final dark = Theme.of(context).brightness == Brightness.dark;
    return Container(
      padding: const EdgeInsets.all(NetScopeTokens.spacingXl),
      decoration: BoxDecoration(
        color: dark ? NetScopeTokens.darkSurface : NetScopeTokens.lightSurface,
        border: Border.all(
          color: dark ? NetScopeTokens.darkBorder : NetScopeTokens.lightBorder,
        ),
        borderRadius: BorderRadius.circular(NetScopeTokens.radiusSurface),
      ),
      child: child,
    );
  }
}
