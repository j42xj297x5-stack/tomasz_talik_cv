# Model treści

## Cel

Dokument jest źródłem prawdy dla organizacji danych JSON. Zależy od decyzji ogólnych z `docs/current/README.md` i jest używany przez dokumenty o personalizacji, PDF, edytorze lokalnym i frontendzie.

## Zasada główna

Istnieje jedna główna baza treści publicznych oraz wiele profili firm. Profile nie kopiują danych CV. Profil wskazuje treści przez stabilne identyfikatory, np. identyfikatory projektów, doświadczeń, umiejętności, sekcji i wariantów tekstów.

## Dane publiczne

Dane publiczne mogą być zapisane w `content/` i zbundlowane lub pobrane przez statyczny frontend. Obejmują wyłącznie informacje, które mogą być publicznie widoczne.

Przykładowe grupy danych:

* sekcje strony;
* projekty;
* doświadczenie;
* umiejętności;
* publiczne linki;
* teksty interfejsu;
* profile firm bez danych poufnych.

## Dane prywatne

Dane prywatne nie mogą być zapisane w publicznym JSON, HTML ani JavaScript. Dotyczy to między innymi informacji kontaktowych lub innych danych, które mają być udostępniane tylko po autoryzacji. Te dane będą w przyszłości pobierane z zewnętrznego backendu.

## Stabilne identyfikatory

Każdy element treści, który może być wybierany przez profil firmy, musi mieć stabilny identyfikator. Identyfikator nie powinien zmieniać się przy redakcji tekstu. Dzięki temu profil może wskazywać element bez kopiowania jego treści.

## Profile firm

Profil firmy może zawierać:

* `profileId`;
* nazwę profilu widoczną administracyjnie;
* listę identyfikatorów sekcji;
* listę identyfikatorów projektów lub doświadczeń;
* kolejność prezentacji;
* warianty akcentów i tagów;
* krótką wiadomość do firmy o długości 300–500 znaków na głównej karcie;
* ustawienia widoczności publicznych elementów.

Profil nie może zawierać skopiowanych opisów projektów, doświadczenia ani danych prywatnych.

## Języki

Startowa wersja jest po polsku. Model danych ma być gotowy na kolejne języki przez rozdzielenie identyfikatora treści od lokalizowanego tekstu. Dodanie języka nie powinno wymagać zmiany identyfikatorów profili.

## Zależności

* Personalizacja korzysta z tego modelu w `docs/current/product/PERSONALIZATION_SYSTEM.md`.
* Edytor Streamlit ma walidować ten model zgodnie z `docs/current/technical/LOCAL_EDITOR.md`.
* PDF renderuje te same dane zgodnie z `docs/current/technical/PDF_PIPELINE.md`.

